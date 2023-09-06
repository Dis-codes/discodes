<script lang="ts">
    import { NavBar, Loading } from '$lib/components/Components';
    import { onMount } from 'svelte';

    import {GetUserRoles, GetUserBadges} from 'discodes-utilities';
    let user: any = null;
    let datas: any = null;
    let badges: string[] = [];
    const badgesMap: any = {
        "932651844428251195" : {
            "name": "Developer",
            "color": "text-blue-500 badge badge-outline"
        },
        "933990402078408715": {
            name : "S4D staff",
            color : "text-yellow-500 badge badge-outline"
        },
        "1144641299748769864" : {
            name : "Alpha",
            color: "text-green-500 badge badge-outline"
        },
        "pro" : {
            name : "Pro",
            color: "text-pink-500 badge badge-outline"
        },
        "932656700664717402" : {
            name : "VIP",
            color: "text-purple-500 badge badge-outline"
        },
        "932656148417486888" : {
            name : "Community Team",
            color: "text-green-500 badge badge-outline"
        }
    };
    export let data
    let { supabase, session } = data
    $: ({ supabase, session } = data)

    let plugins:any[] = [];
    let showAllPlugins = false; // Initially show only 4 plugins

    onMount(async () => {
        let username = window.location.pathname.split('/')[2];
        const { data, error } = await supabase
        .from('profiles')
            .select('*')
            .eq('username', username);
            
            user = data[0];
            
            const { data: identity, error: e2 } = await supabase
            .from('identity')
            .select('*')
            .eq('id', user.id);
            if (error || e2) {
                return;
            }
            user = { ...user, ...identity[0] };
            console.log(user)
        if (identity[0].achievements){
            badges = (await GetUserRoles(user.discord_id))
        }
        badges = GetUserBadges(badges)
        if (identity[0].pro){
            badges.push("pro")
        }
        const { data: pluginsData, error: e3} = await supabase
            .from('marketplace')
            .select('*')
            .eq('user_id', user.id);
            if (e3) {
                return;
            }
            console.log(pluginsData)
            plugins = [...pluginsData]
            
    });
</script>

<NavBar />

{#if user}
<div class="flex flex-col lg:flex-row items-center justify-center lg:h-screen md:mx-10 mt-20 lg:mt-0">
    <!-- Left Screen (User Profile) -->
    <div class="flex flex-col shadow-xl mt-8 border border-neutral rounded-xl mb-5 lg:mb-20 w-full lg:w-[500px] lg:h-[579px] lg:mt-0 lg:mb-0">
      <div class="card-body flex flex-row lg:flex-col">
  
        <!-- User Image -->
        <img src={user.avatar_url} alt="User" class="w-24 h-24 rounded-full ring ring-neutral notfound"><br>
        <div>
          <p class="text-xl font-bold">{user.display_name}</p>
          <p>@{user.username}</p>
  
          <!-- Badges -->
          {#if badges.length > 0}
          <div class="hidden lg:block"><div class="divider"></div></div>
          <div class="border border-neutral shadow-xl text-white rounded-lg md:rounded-full lg:mb-6 mt-6 lg:mt-0">
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 m-2">
                {#each badges as badgeId}
                {#if badgesMap[badgeId]}
                <div class="flex">
                    <span class={badgesMap[badgeId].color + " flex rounded-full truncate w-full py-3    "}>{badgesMap[badgeId].name}</span>
                </div>
                    {/if}
                    {/each}
            </div>
          </div>
            {/if}
        </div>
  
        <!-- User Bio -->
        <div class="flex-col text-white rounded-lg hidden lg:flex">
            <p class="text-gray-400 font-semibold">Bio:<br></p>
            <p>{user.bio}</p>
        </div>
    </div>
    <div class="flex flex-col text-white rounded-lg px-4 lg:hidden">
        <p class="text-gray-400 font-semibold">Bio:<br></p>
        <p>{user.bio}</p>
    </div>
    <p class="text-gray-400 ml-4 lg:ml-8 mb-4">Joined: {new Date(user.created_at).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
</div>

  

    <div class="w-full lg:ml-4 lg:h-[579px] flex flex-col gap-4">
        <div class="flex-1 flex flex-col border border-neutral rounded-xl">

            <!-- Info content -->
            <div class="flex-1 shadow-xl">
                <h1 class="text-xl p-6 md:text-4xl font-bold">User stats</h1>
                <div class="flex mx-auto md:ml-6 justify-center md:justify-normal">
                    <div class="stats stats-horizontal">
                        {#if !user.private}

                        <div class="stat">
                            <a href="/user/{user.username}/followers" class="stat-title">Followers</a>
                            <div class="stat-value text-center">{user.followers ? user.followers.length : 0}</div>
                        </div>
                        
                        <div class="stat">
                            <a href="/user/{user.username}/following" class="stat-title">following</a>
                            <div class="stat-value text-center">{user.following ? user.following.length : 0}</div>
                        </div>
                        
                        <div class="stat">
                            <div class="stat-title">Downloads</div>
                            <div class="stat-value text-center">{user.plugins_downloads || 0}</div>
                        </div>
                        {:else}
                        <div class="stat">
                            <div class="stat-title">This user has private profile</div>
                        </div>
                        {/if}
                    </div>                
                </div>
            </div>
        </div>

        <div class="flex-1 flex flex-col border border-neutral rounded-xl ">
            <!-- Info content -->
            <div class="flex-1 p-6 shadow-xl card-body">
                <h1 class="text-xl md:text-4xl font-bold">Plugins</h1>
                {#if !user.private}
                <div class="ml-6 mt-4 md:flex gap-2 hidden">
                    {#each plugins.slice(0,  4) as plugin}
                        <div class="shadow-xl py-16 w-1/4 rounded-lg border border-spacing-0.5 border-neutral">
                            <div class="text-center">
                                <a href="/user/{user.username}/plugins/{plugin.id}" class="font-bold hover:underline text-xl">{plugin.name}</a>
                                <p class="font-">{plugin.description}</p>
                                <p class="text-sm font-semibold mt-1 text-cyan-400"> {((new Date(plugin.created_at)).toLocaleDateString('en-GB'))}</p>
                            </div>
                        </div>
                    {/each}
                </div>
                {#if plugins.length == 0}
                <div class="stat">
                    <div class="stat-title">This user is yet to publish any plugins!</div>
                </div>
                {:else}
                    <div class="text-center md:text-right mt-4">
                        <a href="/user/{user.username}/plugins" class="text-blue-500 hover:underline cursor-pointer">View all plugins</a> 
                    </div>
                {/if}
                {:else}
                <div class="stat">
                    <div class="stat-title">This user has private profile</div>
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