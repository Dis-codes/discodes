<script lang="ts">
    import NavBar from '$lib/components/NavBar.svelte';
    import { supabase } from '$lib/supabase';
    import { onMount } from 'svelte';
    import Loading from '$lib/components/Loading.svelte';

    import GetUserRoles from '$lib/utils/server';
    import GetBadges from '$lib/utils/getBadges';

    let user: any = null;
    let datas: any = null;
    let badges: string[] = [];
    const badgesMap: any = {
        "1138771459938988052" : {
            "name": "Developer",
            "color": "text-blue-500 badge badge-outline"
        },
        "1139721194225016862": {
            name : "S4D staff",
            color : "text-yellow-500 badge badge-outline"
        },
        "1139658510343344291" : {
            name : "Alpha",
            color: "text-green-500 badge badge-outline"
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
        badges = (await GetUserRoles(user.discord_id))
        badges = GetBadges(badges)
    });
</script>

<NavBar />

{#if user}
<div class="flex items-center justify-center h-screen mx-10">
    <!-- Left Screen (User Profile) -->
    <div style="height: 54%;" class="shadow-xl mt-8 w-1/4 p-8 border border-neutral rounded-xl mb-20 ">
    
        <!-- User Image -->
        <img src={user.avatar_url} alt="User Image" class="w-24 h-24 rounded-full  mb-4 ring ring-neutral">
        <p class="text-xl font-bold">{user.display_name}</p>
        <p>@{user.username}</p>
        <!-- <p class="transperent">{user.discord_id}</p> -->
        <!-- Badges -->
        <div class="divider"></div>
        <div class="border border-neutral shadow-xl text-white rounded-full mb-4">
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

        <div class="text-white rounded-lg">
            <p class="text-gray-400 font-semibold">Description:<br></p>
            <p> {user.bio}</p>
        </div>
        <p class="text-gray-400 mt-32">Joined: {new Date(user.created_at).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
    </div>
    <div class="ml-4 w-full">
        <div class="flex-1 flex flex-col border border-neutral rounded-xl mb-4">
            <!-- Info content -->
            <div class="flex-1 p-6 shadow-xl">
                <h1 class="text-4xl font-bold mb-5">User status<br></h1>
                <div class="ml-6">
                    <div class="stats stats-horizontal mt-3">
  
                        <div class="stat">
                          <div class="stat-title">Followers</div>
                          <div class="stat-value">{user.followers ? user.followers.length : 0}</div>
                        </div>
                        
                        <div class="stat">
                          <div class="stat-title">Following</div>
                          <div class="stat-value">{user.following ? user.following.length : 0}</div>
                        </div>
                        
                        <div class="stat">
                          <div class="stat-title">Plugin Downloads:</div>
                          <div class="stat-value">{user.plugins_downloads || 0}</div>
                        </div>
                    </div>                
                </div>
            </div>
        </div>
        <div class="flex-1 flex flex-col border border-neutral rounded-xl mb-12">
            <!-- Info content -->
            <div class="flex-1 p-6 shadow-xl">
                <h1 class="text-3xl font-bold">Plugins</h1>
                <div class="ml-6 mt-4 flex gap-2">
                    {#each plugins.slice(0,  4) as plugin}
                        <div class="shadow-xl py-16 w-1/4 rounded-lg border border-spacing-0.5 border-neutral">
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
<style>
    .transperent{
     color: rgba(128, 128, 128, 0.171);
    }
</style>
