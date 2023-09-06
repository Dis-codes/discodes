<script lang="ts">
    import { onMount } from 'svelte';
    import { NavBar, Loading } from "$lib/components/Components";
    import { settings } from '$lib/stores';
    import { setNotification, getFollowing} from '$lib/components/supabase';
    export let data
    let { supabase, session } = data
    $: ({ supabase, session } = data)

    let loggedUser = session?.user?.user_metadata?.full_name;
    let following = []
    let keyword: string = '';
    let errorTxt: string = '';
    let searchResults:any = [];
    let currentPage: number = 1;
    const resultsPerPage = 6;
    let totalPages = 0;
    const currentDate:any = new Date();
    const maxSessionDuration = 86400 * 1000
    let contentLoaded = false;
    const fetchSearchResults = async () => {
      keyword = '';
      keyword = window.location.href.split('?keyword=')[1];
      if (!keyword || keyword.length < 3) {
        errorTxt = 'Please enter at least 3 characters.';
        contentLoaded = true;
        return;
      }
  
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('display_name', { ascending: $settings.sortingMethod === "ascending" })
        //.or(`display_name.ilike.%${keyword}%,username.ilike.%${keyword}%`);

      if (error) {
        console.error('Error fetching search results:', error);
      } else {
        searchResults = data; 
        totalPages = Math.ceil(searchResults.length / resultsPerPage);
        if (searchResults > 0) {
          await supabase
            .from('identity')
            .select('following')
            .eq('id', loggedUser.id);
        }
      }
      if (searchResults.length === 0) {
        errorTxt = 'No results found.';
      }
      contentLoaded = true;
    }

    onMount(fetchSearchResults);

    async function toggleFollow(id: string) {
  try {
    // Fetch the current user's following list
    const { data: followingData, error: followingError } = await supabase
      .from('identity')
      .select('following')
      .eq('id', session?.user?.id);

    if (followingError) {
      console.error('Error fetching following:', followingError);
      return;
    }

    let following = followingData[0]?.following || [];
    const isNew = !following.includes(id);
    // Toggle follow/unfollow
    if (following.includes(id)) {
      following = following.filter(f => f !== id);
    } else {
      following.push(id);
    }

    // Update the following list for the current user
    const { data: updatedFollowingData, error: updateFollowingError } = await supabase
      .from('identity')
      .update({ following })
      .eq('id', session?.user?.id)
      .select();

    if (updateFollowingError) {
      console.error('Error updating following:', updateFollowingError);
      return;
    }

    // Fetch the user being followed to update their followers list
    const { data: followersData, error: followersError } = await supabase
      .from('identity')
      .select('followers')
      .eq('id', id);

    if (followersError) {
      console.error('Error fetching followers:', followersError);
      return;
    }

    let followers = followersData[0]?.followers || [];

    // Toggle follow/unfollow from the follower's perspective
    if (followers.includes(session?.user?.id)) {
      if (isNew) return
      followers = followers.filter(f => f !== session?.user?.id);
    } else {
      if (!isNew) return
      followers.push(session?.user?.id);
    }

    // Update the followers list for the user being followed
    const { data: updatedFollowersData, error: updateFollowersError } = await supabase
      .from('identity')
      .update({ followers })
      .eq('id', id)
      .select();

    if (updateFollowersError) {
      console.error('Error updating followers:', updateFollowersError);
      return;
    }

    // Check if a new follower notification should be sent
    if (followers.includes(session?.user?.id)) {
      await setNotification(
        supabase,
        id,
        'New follower',
        `${session?.user?.user_metadata?.full_name} is now following you!`
      );
    }
  } catch (error) {
    console.error('Error toggling follow:', error);
  }
}
async function initialize() {
  following = await getFollowing(supabase, session?.user?.id);
}

initialize()
  </script>
  
  <NavBar />
  {#if contentLoaded}
  <div class="container mx-auto mt-24">
    <h1 class="text-2xl font-bold mb-4 ml-2 sm:ml-0">Users Results for <span class="font-normal">{keyword}</span></h1>
    {#if errorTxt}
      <p class="text-center font-bold text-lg">{errorTxt}</p>
    {:else}
  {#if searchResults.length > 1}
    <p class="ml-2 sm:ml-0">Showing {(currentPage - 1) * resultsPerPage + 1} - {currentPage * resultsPerPage > searchResults.length? searchResults.length : currentPage * resultsPerPage} of {searchResults.length} users</p>
    {/if}
    <div class="flex flex-wrap sm:mx-4">
      {#each searchResults.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage) as user}
        <div class="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 sm:px-4 mb-4">
          <div class="h-fit bg-base-100 shadow-xl p-3 rounded-lg">
            <div class="ml-4 md:ml-6 md:mt-6 mt-4 flex flex-row sm:flex-col sm:flex gap-2">
              <h2 class="flex items-start">
                <img src={user.avatar_url} alt="Avatar" class="h-20 w-20 rounded-full mb-2 outline outline-cyan-700 notfound" />
              </h2>
              <div class="flex-1">
                <a class="text-xl font-semibold link link-hover" href="/user/{user.username}">{user.display_name ? user.display_name : user.username}</a>
                <p class="text-gray-500">@{user.username}</p>
                <div class="flex justify-between">
                  {#if (currentDate - new Date(user.logged_at)) <= maxSessionDuration}
                  <p class="text-sm font-semibold mt-1 text-cyan-400">online</p>
                  {:else}
                  <p class="text-sm font-semibold mt-1 text-gray-500">offline</p>
                  {/if}
                  <div class="text-sm text-gray-500">
                    {#if user.username === loggedUser}
                    <p class="mr-2">This is you</p>
                    {:else}
                    <button on:click={toggleFollow(user.id)} class="btn btn-info btn-xs sm:btn-md mt-1 sm:-mt-4 mr-2 sm:mr-0">
                      {following?.includes(user?.id) ? "Unfollow" : "Follow"}
                    </button>
                    {/if}
                  </div>
                </div>
              </div>
    
            </div>
          </div>
        </div>
      {/each}
    </div>
    
    
      <!-- add buttons to change page -->
        <div class="flex justify-center mt-4 mb-4 {totalPages == 1 ? "hidden" : ""}">
        <a
            class="btn btn-outline btn-sm mr-2 {currentPage === 1 ? 'btn-disabled' : ''}"
            on:click={() => currentPage = 1}
          ><span class="material-symbols-outlined">first_page</span></a>
        <a
            class="btn btn-outline btn-sm mr-2 {currentPage === 1 ? 'btn-disabled' : ''}"
            on:click={() => currentPage--}
          ><span class="material-symbols-outlined">navigate_before</span></a>
       <p>Page {currentPage} of {totalPages}</p>

        <a
            class="btn btn-outline btn-sm ml-2 {currentPage === totalPages ? 'btn-disabled' : ''}"
            on:click={() => currentPage++}
        ><span class="material-symbols-outlined">navigate_next</span></a>
        <a
            class="btn btn-outline btn-sm ml-2 {currentPage === totalPages ? 'btn-disabled' : ''}"
            on:click={() => currentPage = totalPages}
          ><span class="material-symbols-outlined">last_page</span></a>
        </div>
    {/if}
  </div>
  {:else}
<Loading />
    {/if}   