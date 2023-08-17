<script lang="ts">
    import { onMount, afterUpdate } from 'svelte';
    import NavBar from '$lib/components/NavBar.svelte';
    import { supabase } from '$lib/supabase';
    export let data;
    const { session } = data;
    let loggedUser = session?.user?.user_metadata?.full_name;
    let keyword = '';
    let errorTxt = '';
    let searchResults = [];
    let currentPage = 1;
    const resultsPerPage = 12;
    let totalPages = 0;
    const currentDate = new Date();
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
      }
      if (searchResults.length === 0) {
        errorTxt = 'No results found.';
      }
      contentLoaded = true;
    }

    onMount(fetchSearchResults);
  </script>
  
  <NavBar />
  {#if contentLoaded}
  <div class="container mx-auto mt-24">
    <h1 class="text-2xl font-bold mb-4">Users Results for <span class="font-normal">{keyword}</span></h1>
    {#if errorTxt}
      <p class="text-center font-bold text-lg">{errorTxt}</p>
    {:else}
    <p>Showing {(currentPage - 1) * resultsPerPage + 1} - {currentPage * resultsPerPage > searchResults.length? searchResults.length : currentPage * resultsPerPage} of {searchResults.length} users</p>
      <div class="flex flex-wrap -mx-4">
        {#each searchResults.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage) as user}
        <div class="w-1/3">
            <div class="m-2 bg-zinc-700  rounded pb-2 px-2 ">
            <div class="flex  pt-2 ">
                <img
                    src={user.avatar_url}
                    alt="Avatar"
                    class="h-24 rounded-full mr-4"
                />
                <div class="flex-1">
                    <p class="text-lg font-bold">{user.display_name}</p>
                    <p class="text-gray-500">@{user.username}</p>
                    <p class="text-gray-500">{((currentDate - new Date(user.logged_at)) <= maxSessionDuration) ? "online" : "offline"}</p>
                </div>
            </div>
            
            {#if user.username === loggedUser}
                <div class="text-center"><p>This is you</p></div>
        {:else}
            <div class="text-center">
                <a class="mt-2 w-full border rounded-lg px-4 py-2 btn btn-outline no-animation btn-sm">Add as friend</a>
            </div>
        {/if}
    </div>
        </div>
        
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
  <div class="flex flex-col items-center justify-center h-screen">
  <span class="loading loading-spinner text-discodes loading-lg"></span>
</div>
    {/if}   