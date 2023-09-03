<script lang="ts">
    import { NavBar, Loading } from '$lib/components/Components';
    import { onMount } from 'svelte';
    let plugins:any[] = [];

    export let data
    let { supabase, session } = data
    $: ({ supabase, session } = data)

    onMount(async () => {
        let username = window.location.pathname.split('/')[2];
        console.log(username)
        const { data: pluginsData, error: e3} = await supabase
            .from('marketplace')
            .select('*')
            .eq('user', username);
            if (e3) {
                return;
            }
            console.log(pluginsData)
            plugins = [...pluginsData]
            
    });
</script>

<NavBar />

{#if plugins.length > 0}

<div class="flex items-center justify-center h-screen mx-10">
    <div class="ml-4 w-full">
        <div class="flex-1 flex flex-col border border-neutral rounded-xl mb-12">
            <!-- Info content -->
            <div class="flex-1 p-6 shadow-xl">
                <h1 class="text-3xl font-bold">Plugins</h1>
                <div class="ml-6 mt-4 flex gap-2">
                    {#each plugins as plugin}
                        <div class="shadow-xl py-4 w-1/4 rounded-lg border border-spacing-0.5 border-neutral">
                            <div class="text-center">
                                <a href="/user/{plugin.user}/plugins/{plugin.id}" class="font-bold hover:underline">{plugin.name}</a>
                                <p>{plugin.description}</p>
                                <p class="text-sm font-semibold mt-1 text-cyan-400"> {((new Date(plugin.created_at)).toLocaleDateString('en-GB'))}</p>
                            </div>
                            <div class="mt-4 text-center">
                                <a href="/user/{plugin.user}/plugins/{plugin.id}?download=true" class="btn btn-info btn-l">Download</a>
                            </div> 
                        </div>
                    {/each}
                </div>
            </div>
            
        </div>
    </div>
</div>
{:else}
<Loading />
{/if}

