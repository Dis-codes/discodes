<script lang="ts">
    import { onMount } from 'svelte';
    import { NavBar, Loading } from "$lib/components/Components";
    export let data;
    const { session, supabase } = data;
    let loggedUser = session?.user?.user_metadata?.full_name;
    let following = []
    let keyword: string = '';
    let errorTxt: string = '';
    let searchResults:any = [];
    let currentPage: number = 1;
    const resultsPerPage = 12;
    let totalPages = 0;
    const currentDate:any = new Date();
    const maxSessionDuration = 86400 * 1000
    let contentLoaded = false;
    const fetchSearchResults = async () => {
      keyword = '';
      keyword = window.location.href.split('?keyword=')[1];
      if (!keyword || keyword.length < 3) {
        errorTxt = 'Please enter at least 3 characters.';
        return;
      }
  
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`display_name.ilike.%${keyword}%,username.ilike.%${keyword}%`);
  
      if (error) {
        console.error('Error fetching search results:', error);
      } else {
        searchResults = data;
        totalPages = Math.ceil(searchResults.length / resultsPerPage);
        if (searchResults > 0) {
          const { data: followersData, error: followersError } = await supabase
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
    async function toggleFollow(id) {
  console.log(session);
  if (!following) return;

  try {
    let newFollowing = following.includes(id) ? following.filter(f => f !== id) : [...following, id]
    const { data, error } = await supabase
      .from('identity')
      .update({ following: newFollowing
      })
      .eq('id', session?.user?.id)
      .select()
    if (error) {
      console.error('Error toggling follow:', error);
    } else {
      following = data[0]?.following || [];
    }
  } catch (error) {
    console.error('Error toggling follow:', error.message);
  }
}

async function getFollowing() {
  try {
    const { data, error } = await supabase
      .from('identity')
      .select('following')
      .eq('id', session?.user?.id);

    if (error) {
      console.error('Error fetching following:', error);
    } else {
      following = data[0]?.following || [];
      console.log(following);
    }
  } catch (error) {
    console.error('Error fetching following:', error.message);
  }
}

async function initialize() {
  await getFollowing();
}

initialize()
  </script>
  
  <NavBar />
  {#if contentLoaded}
  <div class="container mx-auto mt-24">
    <h1 class="text-2xl font-bold mb-4">Users Results for <span class="font-normal">{keyword}</span></h1>
    {#if errorTxt}
      <p class="text-center font-bold text-lg">{errorTxt}</p>
    {:else}
    <p>Showing {(currentPage - 1) * resultsPerPage + 1} - {currentPage * resultsPerPage > searchResults.length? searchResults.length : currentPage * resultsPerPage} of {searchResults.length} users</p>
    <!-- --Nikola was here :) -->
    <div class="flex flex-wrap -mx-4">
        {#each searchResults.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage) as user}

        <div class="w-1/3">
              <div class="card w-96 h-60 bg-base-100 shadow-xl p-3 rounded-lg ">
                <div class="card-body">
                  <h2 class="flex flex-col items-start">
                    <img
                    src={user.avatar_url}
                    alt="Avatar"
                    class="h-20 w-20 rounded-full mb-2 outline outline-cyan-700"/>
                  </h2>
                    <div class="flex-1">
                      <a class="text-xl font-semibold link link-hover" href="/user/{user.username}">{user.display_name}</a>
                      <p class="text-gray-500">@{user.username}</p>
                      <p class="text-sm font-semibold mt-1 text-cyan-400">{((currentDate - new Date(user.logged_at)) <= maxSessionDuration) ? "online" : "offline"}</p>
                  </div>
                  <div class="absolute bottom-48 right-2 mt-1 mr-2">
                      <div class="dropdown dropdown-end">
                        <label tabindex="0" class="btn btn-circle btn-ghost btn-xs text-info">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </label>
                        <div tabindex="0" class="card compact dropdown-content z-[1] shadow-xl bg-base-100 rounded-box w-56">
                          <div class="card-body">
                            <h2 class="card-title font-semibold">About me:</h2> 
                            <p>Have fun make the about me user puts here!</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  {#if user.username === loggedUser}
                  <div class="text-center mt-2">
                    <p class="text-sm text-gray-500 mt-4">This is you</p>
                  </div>
                  
          {:else}
              <div class="text-center">
                <div class="absolute bottom-4 right-4 mb-2 mr-2">
                  <button on:click={toggleFollow(user.id)} class="btn btn-info btn-l">{following?.includes(user?.id) ? "Unfollow" : "Follow"}</button>
            </div>
              </div>
          {/if}
            </div>
    </div>
        </div>
        <!-- to here -->
        {/each}
      </div>
      <!-- add buttons to change page -->
        <div class="flex justify-center mt-4 ">
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