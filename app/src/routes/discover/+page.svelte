<!-- DiscoverPage.svelte -->

<script lang="ts">
    import { onMount } from 'svelte';
    import { NavBar, Loading, PluginCard } from "$lib/components/Components"; // Import PluginCard component
    export let data;
    let { supabase, session } = data;
    $: ({ supabase, session } = data);
    let searchResults: any = [];
    let contentLoaded = false;
    let itemsPerPage = 4;
    let mostDownloadedSliceIndex = 0;
    let topRatedSliceIndex = 0;
    let featuredSliceIndex = 0;
    let popularSliceIndex = 0;
    const fetchSearchResults = async () => {
        const { data, error } = await supabase
            .from('marketplace')
            .select('*');
        searchResults = data;
        contentLoaded = true;
    }

    onMount(() => {
        fetchSearchResults();
        if (window.innerWidth < 1536) itemsPerPage = 3;
        if (window.innerWidth < 1280) itemsPerPage = 2;
        if (window.innerWidth < 1024) itemsPerPage = 1;
    })
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    function nextSlice(category: string) {
        if (category === 'mostDownloaded' && mostDownloadedSliceIndex + itemsPerPage < searchResults.length) {
            mostDownloadedSliceIndex += itemsPerPage;
        } else if (category === 'topRated' && topRatedSliceIndex + itemsPerPage < searchResults.length) {
            topRatedSliceIndex += itemsPerPage;
        } else if (category === 'featured' && featuredSliceIndex + itemsPerPage < searchResults.length) {
            featuredSliceIndex += itemsPerPage;
        } else if (category === 'popular' && popularSliceIndex + itemsPerPage < searchResults.length) {
            popularSliceIndex += itemsPerPage;
        }
    }
    function prevSlice(category: string) {
        console.log(mostDownloadedSliceIndex)
        if (category === 'mostDownloaded' && mostDownloadedSliceIndex >= itemsPerPage) {
            mostDownloadedSliceIndex -= itemsPerPage;
        } else if (category === 'topRated' && topRatedSliceIndex >= itemsPerPage) {
            topRatedSliceIndex -= itemsPerPage;
        } else if (category === 'featured' && featuredSliceIndex >= itemsPerPage) {
            featuredSliceIndex -= itemsPerPage;
        } else if (category === 'popular' && popularSliceIndex >= itemsPerPage) {
            popularSliceIndex -= itemsPerPage;
        }
    }
</script>

<NavBar />
<div class="mt-28">
    <h1 class="text-6xl font-bold mb-4 p-10 ml-12">Discover</h1>
<div class="container mt-14 mx-auto">
    {#if contentLoaded}
    <div class="border border-collapse border-neutral-700 sm:rounded-xl shadow-2xl">
        <h2 class="text-2xl font-bold p-5">Most Downloaded</h2>
        <div class="flex justify-between mx-3 sm:mx-7 mb-8">
            <button class="btn btn-circle btn-neutral my-28  {mostDownloadedSliceIndex >= itemsPerPage ? '' : 'btn-disabled'}" on:click={() => prevSlice('mostDownloaded')}><span class="material-symbols-outlined">navigate_before</span></button>
            <div class="flex flex-wrap p-3">
                {#each searchResults
                    .sort((a, b) => b.downloads - a.downloads)
                    .slice(mostDownloadedSliceIndex, mostDownloadedSliceIndex + itemsPerPage) as plugin}
                    <PluginCard {plugin} />
                {/each}
            </div>
            <button class="btn btn-circle btn-neutral my-28 {mostDownloadedSliceIndex + itemsPerPage < searchResults.length ? '' : 'btn-disabled'}" on:click={() => nextSlice('mostDownloaded')}><span class="material-symbols-outlined">navigate_next</span></button>
        </div>
    </div>
    <div class="border border-collapse border-neutral-700 sm:rounded-xl shadow-2xl mt-10">
        <h2 class="text-2xl font-bold p-5">Popular</h2>
        <div class="flex justify-between mx-3 sm:mx-7 mb-8">
            <button class="btn btn-circle btn-neutral my-28 {popularSliceIndex >= itemsPerPage ? '' : 'btn-disabled'}" on:click={() => prevSlice('popular')}><span class="material-symbols-outlined">navigate_before</span></button>
            <div class="flex flex-wrap p-3 mb-2">
                {#each searchResults
                    .sort((a, b) => b.rating - a.rating)
                    .slice(popularSliceIndex, popularSliceIndex + itemsPerPage) as plugin}
                    <PluginCard {plugin} />
                {/each}
            </div>
            <button class="btn btn-circle btn-neutral my-28 {popularSliceIndex + itemsPerPage < searchResults.length ? '' : 'btn-disabled'}" on:click={() => nextSlice('popular')}><span class="material-symbols-outlined">navigate_next</span></button>
        </div>
        </div>
    <div class="border border-collapse border-neutral-700 sm:rounded-xl shadow-2xl mt-10">
        <h2 class="text-2xl font-bold p-5">Featured</h2>
        <div class="flex justify-between mx-3 sm:mx-7 mb-8">
            <button class="btn btn-circle btn-neutral my-28 {featuredSliceIndex >= itemsPerPage ? '' : 'btn-disabled'}" on:click={() => prevSlice('featured')}><span class="material-symbols-outlined">navigate_before</span></button>
            <div class="flex flex-wrap p-3 mb-2">
                {#each shuffleArray(searchResults).slice(featuredSliceIndex, featuredSliceIndex + itemsPerPage) as plugin}
                    <PluginCard {plugin} />
                {/each}
            </div>
            <button class="btn btn-circle btn-neutral my-28 {featuredSliceIndex + itemsPerPage < searchResults.length ? '' : 'btn-disabled'}" on:click={() => nextSlice('featured')}><span class="material-symbols-outlined">navigate_next</span></button>
        </div>
    </div>
    <div class="border border-collapse border-neutral-700 sm:rounded-xl shadow-2xl mt-10">
        <h2 class="text-2xl font-bold p-5">Top Rated</h2>
        <div class="flex justify-between mx-3 sm:mx-7 mb-8">
            <button class="btn btn-circle btn-neutral my-28 {topRatedSliceIndex >= itemsPerPage ? '' : 'btn-disabled'}" on:click={() => prevSlice('topRated')}><span class="material-symbols-outlined">navigate_before</span></button>
            <div class="flex flex-wrap p-3 mb-2">
                {#each searchResults
                    .sort((a, b) => {
            const ratioA = a.downloads > a.rating ? a.rating / a.downloads : 0;
            const ratioB = b.downloads > b.rating ? b.rating / b.downloads : 0;
            return ratioB - ratioA;
        }).slice(topRatedSliceIndex, topRatedSliceIndex + itemsPerPage) as plugin}
                    <PluginCard {plugin} />
                {/each}
            </div>
            <button class="btn btn-circle btn-neutral my-28 {topRatedSliceIndex + itemsPerPage < searchResults.length ? '' : 'btn-disabled'}" on:click={() => nextSlice('topRated')}><span class="material-symbols-outlined">navigate_next</span></button>
        </div>
    </div>
     <div class="mb-10 flex flex-col text-center gap-4 mt-12">
        <h2 class="text-2xl font-bold">Other</h2>
        <a href="/search/marketplace" class="link link-primary">View all</a>
     </div>
    {:else}
        <Loading />
    {/if}
</div>
</div>

