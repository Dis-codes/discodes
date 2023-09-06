<script lang="ts">
    import { onMount } from 'svelte';
    import { NavBar, Loading } from "$lib/components/Components";
    import {settings} from "$lib/stores";
    export let data
    let { supabase, session } = data
    $: ({ supabase, session } = data)
    let loggedUser = session?.user?.user_metadata?.full_name;
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
      keyword = keyword ? keyword : '';
      const { data, error } = await supabase
        .from('marketplace')
        .select('*')
        .order('name', { ascending: $settings.sortingMethod === "ascending" })
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
    <div class="flex flex-wrap sm:mx-4">
      {#each searchResults.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage) as plugin}
      <div class="w-full md:w-1/2  lg:w-1/3  mb-4">
        <div class="h-fit w-full md:w-80 xl:w-96 bg-base-100 shadow-xl rounded-lg">
            <img class="rounded-t-lg w-full" src="https://picsum.photos/450/250" alt="Shoes" />
          <div class="mx-4 md:ml-6 md:mt-6 mt-4 flex flex-col sm:flex gap-2">
            <div class="flex flex-col">
              <p class="text-xl font-bold">{plugin.name}</p>
              <p class="text-gray-400">{plugin.description}</p>
              <div class="flex flex-col md:flex-row md:justify-between">
              <div class="flex flex-row md:flex-col justify-between">
              <p class="text-sm text-gray-500">@{plugin.user}</p>
              <p class="text-sm font-semibold mt-1 text-cyan-400">30/08/2023</p>
            </div>
            <div class="md:text-center">
              <div class="bottom-4 right-4 mb-2">
                <a href="/user/noxyyk/plugins/9a8c3bc2-b043-49cc-8623-c186fd844503?download=true" class="btn btn-info w-full btn-sm md:btn-md">Download</a>
              </div>
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- to here -->
      {/each}
    </div>
    
      <!-- add buttons to change page -->
        <div class="flex justify-center mt-4 mb-4 ">
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