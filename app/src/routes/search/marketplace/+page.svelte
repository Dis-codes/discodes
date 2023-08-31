<script lang="ts">
    import { onMount } from 'svelte';
    import { NavBar, Loading } from "$lib/components/Components";
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
      keyword = keyword ? keyword : '';
      const { data, error } = await supabase
        .from('marketplace')
        .select('*')
        .or(`name.ilike.%${keyword}%,user.ilike.%${keyword}%,description.ilike.%${keyword}%`);
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
    <h1 class="text-2xl font-bold mb-4">Marketplace Results {keyword ? "for" : ""} <span class="font-normal">{keyword}</span></h1>
    {#if errorTxt}
      <p class="text-center font-bold text-lg">{errorTxt}</p>
    {:else}
    <p>Showing {(currentPage - 1) * resultsPerPage + 1} - {currentPage * resultsPerPage > searchResults.length? searchResults.length : currentPage * resultsPerPage} of {searchResults.length} plugins</p>
    <!-- --Nikola was here :) -->
    <div class="flex flex-wrap -mx-4">
        {#each searchResults.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage) as plugin}

        <div class="w-1/3">
          <div class="card card-compact w-96  bg-base-100 shadow-xl p-2 rounded-lg ">
            <figure><img class="w-auto h-auto" src="https://picsum.photos/450/250" alt="Shoes" /></figure>
                <div class="card-body">
                  <a class="text-xl card-title font-bold link link-hover" style="text-transform:capitalize;" href="/user/{plugin.user}/plugins/{plugin.id}">{plugin.name}</a>
                  <h2 class="flex flex-col items-start">
                  </h2>
                    <div class="flex-1">
                      <!-- <p class="text-gray-500">{plugin.description}</p> -->
                  </div>
              <div class="text-center">
                <div class="absolute bottom-4 right-4 mb-2 mr-2">
                  <a href="/user/{plugin.user}/plugins/{plugin.id}?download=true" class="btn btn-info btn-l">Download</a>
            </div>
              </div>
            </div>
            <p class="text-sm font-semibold mt-1 text-cyan-400 p-4"> {((new Date(plugin.created_at)).toLocaleDateString('en-GB'))}</p>
    </div>
        </div>
        <!-- to here -->
        {/each}
      </div>
      <!-- add buttons to change page -->
        <div class="flex justify-center mt-4 ">
        <button
            class="btn btn-outline btn-sm mr-2 {currentPage === 1 ? 'btn-disabled' : ''}"
            on:click={() => currentPage = 1}
          ><span class="material-symbols-outlined">first_page</span></button>
        <button
            class="btn btn-outline btn-sm mr-2 {currentPage === 1 ? 'btn-disabled' : ''}"
            on:click={() => currentPage--}
          ><span class="material-symbols-outlined">navigate_before</span></button>
       <p>Page {currentPage} of {totalPages}</p>

        <button
            class="btn btn-outline btn-sm ml-2 {currentPage === totalPages ? 'btn-disabled' : ''}"
            on:click={() => currentPage++}
        ><span class="material-symbols-outlined">navigate_next</span></button>
        <button
            class="btn btn-outline btn-sm ml-2 {currentPage === totalPages ? 'btn-disabled' : ''}"
            on:click={() => currentPage = totalPages}
          ><span class="material-symbols-outlined">last_page</span></button>
        </div>
    {/if}
  </div>
  {:else}
<Loading />
    {/if}   