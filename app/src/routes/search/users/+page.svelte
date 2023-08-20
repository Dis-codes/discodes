<script lang="ts">
    import { onMount, afterUpdate } from 'svelte';
    import NavBar from '$lib/components/NavBar.svelte';
    import { supabase } from '$lib/supabase';
    export let data;
    const { session } = data;
    let loggedUser = session?.user?.user_metadata?.full_name;
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
                  <div class="absolute bottom-48 right-2 mb-2 mr-2">
                  <button> 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </button>
                  </div>
                  {#if user.username === loggedUser}
                  <div class="text-center mt-2">
                    <p class="text-sm text-gray-500 mt-2">This is you</p>
                  </div>
                  
          {:else}
              <div class="text-center">
                <div class="absolute bottom-4 right-4 mb-2 mr-2">
                  <button class="btn btn-info btn-l">Follow</button>
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
  <div class="flex flex-col items-center justify-center h-screen">
  <span class="loading loading-spinner text-discodes loading-lg"></span>
</div>
    {/if}   