<!-- DiscoverPage.svelte -->

<script lang="ts">
    import { onMount } from 'svelte';
    import { NavBar, Loading, PluginCard } from "$lib/components/Components"; // Import PluginCard component
    export let data;
    let { supabase, session } = data;
    $: ({ supabase, session } = data);
    let searchResults: any = [];
    let contentLoaded = false;
    const itemsPerPage = 5;
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

    onMount(fetchSearchResults);
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

<div class="container mt-24 mx-auto">
    <h1 class="text-4xl font-bold mb-4">Discover</h1>
    {#if contentLoaded}
    <div>
        <h2 class="text-2xl font-bold">Most Downloaded</h2>
        <div class="flex justify-between items-center -mx-20">
            <button class="btn btn-outline btn-sm {mostDownloadedSliceIndex >= itemsPerPage ? '' : 'btn-disabled'}" on:click={() => prevSlice('mostDownloaded')}><span class="material-symbols-outlined">navigate_before</span></button>
            <div class="flex flex-wrap">
                {#each searchResults
                    .sort((a, b) => b.downloads - a.downloads)
                    .slice(mostDownloadedSliceIndex, mostDownloadedSliceIndex + itemsPerPage) as plugin}
                    <PluginCard {plugin} />
                {/each}
            </div>
            <button class="btn btn-outline btn-sm {mostDownloadedSliceIndex + itemsPerPage < searchResults.length ? '' : 'btn-disabled'}" on:click={() => nextSlice('mostDownloaded')}><span class="material-symbols-outlined">navigate_next</span></button>
        </div>
    </div>
    <div>
        <h2 class="text-2xl font-bold">Popular</h2>
        <div class="flex justify-between items-center -mx-20">
            <button class="btn btn-outline btn-sm {popularSliceIndex >= itemsPerPage ? '' : 'btn-disabled'}" on:click={() => prevSlice('popular')}><span class="material-symbols-outlined">navigate_before</span></button>
            <div class="flex flex-wrap">
                {#each searchResults
                    .sort((a, b) => b.rating - a.rating)
                    .slice(popularSliceIndex, popularSliceIndex + itemsPerPage) as plugin}
                    <PluginCard {plugin} />
                {/each}
            </div>
            <button class="btn btn-outline btn-sm {popularSliceIndex + itemsPerPage < searchResults.length ? '' : 'btn-disabled'}" on:click={() => nextSlice('popular')}><span class="material-symbols-outlined">navigate_next</span></button>
        </div>
    </div>
    <div>
        <h2 class="text-2xl font-bold">Featured</h2>
        <div class="flex justify-between items-center -mx-20">
            <button class="btn btn-outline btn-sm {featuredSliceIndex >= itemsPerPage ? '' : 'btn-disabled'}" on:click={() => prevSlice('featured')}><span class="material-symbols-outlined">navigate_before</span></button>
            <div class="flex flex-wrap">
                {#each shuffleArray(searchResults).slice(featuredSliceIndex, featuredSliceIndex + itemsPerPage) as plugin}
                    <PluginCard {plugin} />
                {/each}
            </div>
            <button class="btn btn-outline btn-sm {featuredSliceIndex + itemsPerPage < searchResults.length ? '' : 'btn-disabled'}" on:click={() => nextSlice('featured')}><span class="material-symbols-outlined">navigate_next</span></button>
        </div>
    </div>
    <div>
        <h2 class="text-2xl font-bold">Top Rated</h2>
        <div class="flex justify-between items-center -mx-20">
            <button class="btn btn-outline btn-sm {topRatedSliceIndex >= itemsPerPage ? '' : 'btn-disabled'}" on:click={() => prevSlice('topRated')}><span class="material-symbols-outlined">navigate_before</span></button>
            <div class="flex flex-wrap">
                {#each searchResults
                    .sort((a, b) => {
            const ratioA = a.downloads > a.rating ? a.rating / a.downloads : 0;
            const ratioB = b.downloads > b.rating ? b.rating / b.downloads : 0;
            return ratioB - ratioA;
        }).slice(topRatedSliceIndex, topRatedSliceIndex + itemsPerPage) as plugin}
                    <PluginCard {plugin} />
                {/each}
            </div>
            <button class="btn btn-outline btn-sm {topRatedSliceIndex + itemsPerPage < searchResults.length ? '' : 'btn-disabled'}" on:click={() => nextSlice('topRated')}><span class="material-symbols-outlined">navigate_next</span></button>
        </div>
    </div>
     <div class="mb-10 flex flex-col text-center gap-4">
        <h2 class="text-2xl font-bold">Other</h2>
        <a href="/search/marketplace" class="link link-primary">View all</a>
     </div>
    {:else}
        <Loading />
    {/if}
</div>