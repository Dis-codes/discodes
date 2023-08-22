<script lang="ts">
    import { NavBar, Loading } from '$lib/components/Components';
    import { supabase } from '$lib/supabase';
    import { onMount } from 'svelte';
    let plugin = null

    onMount(async () => {
        let path = window.location.pathname.split('/')[4];
        //check if ?download=true
        if (window.location.search.split('?download=')[1] === 'true'){
            download()
        }
        const { data: pluginsData, error: e3} = await supabase
            .from('marketplace')
            .select('*')
            .eq('id', path)
            .single();
            if (e3) {
                return;
            }
            console.log(pluginsData)
            plugin = pluginsData
            
    });
    async function download () {
        alert('Downloading...')
    }
</script>

<NavBar />

{#if plugin}

<div class="flex items-center justify-center h-screen mx-10">
    <div class="ml-4 w-96">
        <div class="flex-1 flex flex-col border border-neutral rounded-xl mb-12">
            <!-- Info content -->
            <div class="flex-1 p-6 shadow-xl">
                <h1 class="text-3xl font-bold">{plugin.name}</h1>
                <p class="text-sm font-semibold mt-1 text-cyan-400"> {((new Date(plugin.created_at)).toLocaleDateString('en-GB'))}</p>
                <p>{plugin.description}</p>
                <div class="text-end"><button on:click={download} class="btn btn-info btn-l">Download</button></div>
            </div>
            
        </div>
    </div>
</div>
{:else}
<Loading />
{/if}
<style>
    .transperent{
     color: rgba(128, 128, 128, 0.171);
    }
</style>
