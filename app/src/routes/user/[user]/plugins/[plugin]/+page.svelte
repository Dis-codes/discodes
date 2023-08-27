<script lang="ts">
    import { NavBar, Loading } from '$lib/components/Components';
    import { supabase } from '$lib/supabase';
    import { user } from '$lib/stores';
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

<div class="card card-compact items-center justify-center h-screen mx-10 mt-72">
    <div class="card-body ml-4 w-1/3">
        
        <div class="border border-neutral rounded-xl">
            <figure><img class="w-auto h-auto" src="https://picsum.photos/575/250" alt="" /></figure>
            <!-- Info content -->
            <h1 class="text-3xl font-bold p-4">{plugin.name} <p class="text-base text-gray-600">Made by @{plugin.user}</p></h1>
            <div class="flex-1 p-6 shadow-xl">
                <p class="text-slate-500 ">{plugin.description}</p>
                <div class="flex justify-between items-end">
                    <p class="text-sm font-semibold mt-2  text-cyan-400"> {((new Date(plugin.created_at)).toLocaleDateString('en-GB'))}</p>
                    <button on:click={download} class="btn btn-info btn-l mt-4">Download</button>
                </div>
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