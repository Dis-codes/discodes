<script lang="ts">
    import NavBar from '$lib/components/NavBar.svelte';
    import { supabase } from '$lib/supabase';
    import { onMount } from 'svelte';
    import Loading from '$lib/components/Loading.svelte';
    import GetUserOnDiscord from '$lib/utils/server';

    let user: any = null;
    let datas: any = null;
    let badges: string[] = [];
    const badgesMap: any = {
        "1138771459938988052" : {
            "name": "Developer",
            "color": "bg-blue-500"
        },
        "1139721194225016862": {
            name : "S4D staff",
            color : "bg-yellow-500"
        },
        "1139658510343344291" : {
            name : "Alpha",
            color: "bg-green-500"
        }
    };
    const plugins = [
        { name: "Discord moderation", description: "An unique way to ban Limenade" },
        // Add more plugin objects here
    ];
    let showAllPlugins = false; // Initially show only 4 plugins

    onMount(async () => {
        let username = window.location.pathname.split('/')[2];
        const { data, e } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', username);
        
        user = data[0];
        
        const { data: identity, error: e2 } = await supabase
            .from('identity')
            .select('*')
            .eq('id', user.id);

        if (e || e2) {
            return;
        }

        user = { ...user, ...identity[0] };
        badges = (await GetUserOnDiscord(user.discord_id)).roles
    });
</script>

<NavBar />

{#if user}
<div class="flex items-center justify-center h-screen mx-10">
    <!-- Left Screen (User Profile) -->
    <div class="w-1/4 p-8 border rounded-xl">
        <!-- User Image -->
        <img src={user.avatar_url} alt="User Image" class="w-32 h-32 rounded-full mx-auto mb-4">

        <!-- Badges -->
        <div class="border text-white rounded-full mb-4">
            <div class="mx-2 flex gap-2">
                {#each badges as badgeId}
            {#if badgesMap[badgeId]}
                <div class="py-2">
                    <span class={badgesMap[badgeId].color + " px-2 rounded-full py-1"}>{badgesMap[badgeId].name}</span>
                </div>
            {/if}
        {/each}
            </div>
        </div>

        <div class="border text-white rounded-lg py-40">
            <div class="text-center">
                <p>another info idk</p>
            </div>
        </div>
    </div>

    <div class="ml-4 w-full">
        <div class="flex-1 flex flex-col border rounded-xl mb-4">
            <!-- Info content -->
            <div class="flex-1 p-6 ">
                <h1 class="text-4xl">Info</h1>
                <div class="ml-6">
                    <p class="text-xl font-bold">{user.display_name}</p>
                    <p>@{user.username}</p>
                    <p>ID: {user.discord_id}</p>
                    <p>Bio: {user.bio}</p>
                    <p>Created At: {new Date(user.created_at).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                    <p>Followers: {user.followers ? user.followers.length : 0}</p>
                    <p>Following: {user.following ? user.following.length : 0}</p>
                    <p>Plugin Downloads: {user.plugins_downloads || 0}</p>
                </div>
            </div>
        </div>
        <div class="flex-1 flex flex-col border rounded-xl">
            <!-- Info content -->
            <div class="flex-1 p-6 ">
                <h1 class="text-2xl">Plugins</h1>
                <div class="ml-6 mt-4 flex gap-2">
                    {#each plugins.slice(0,  4) as plugin}
                        <div class="bg-gray-600 py-16 w-1/4 rounded-lg">
                            <div class="text-center">
                                <p class="font-bold">{plugin.name}</p>
                                <p>{plugin.description}</p>
                            </div>
                        </div>
                    {/each}
                </div>
                {#if plugins.length > 4}
                    <div class="text-right mt-4">
                        <a href="/user/{user.username}/plugins" class="text-blue-500 hover:underline cursor-pointer">View all plugins</a> 
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>
{:else}
<Loading />
{/if}
