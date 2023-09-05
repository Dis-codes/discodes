<script lang="ts">
    import { NavBar, Loading } from '$lib/components/Components';
    import { onMount } from 'svelte';

    export let data
    let { supabase, session } = data
    $: ({ supabase, session } = data)

    let user: any = null;
    let filteredProfiles = [];
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
            const { data: profiles, error: e3} = await supabase
            .from('profiles')
            .select('*')

            if (e3) {
                return;
            }
        //if user.following includes profile.id

        filteredProfiles= profiles.filter(profile => user.followers.includes(profile.id));
    });
    function calculateDaysAgo(dateString) {
        const lastLoggedAt = new Date(dateString);
        const currentDate = new Date();
        const timeDifference = currentDate - lastLoggedAt;
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        return daysDifference;
    }
</script>

<NavBar />

{#if user}
<div class="flex items-center justify-center {filteredProfiles.length > 15 ? "mt-20" : "lg:h-screen mt-20 lg:mt-0"}  md:mx-10" >
    <!-- Left Screen (User Profile) -->
    <div class="w-full">
        <div class="flex-1 flex flex-col border border-neutral rounded-xl mb-4">
            <!-- Info content -->
            <div class="flex-1 p-6 shadow-xl">
                <h1 class="text-4xl font-bold mb-10">{user.username}´s followers: </h1>
                <div class="md:ml-6">
                    <div class="flex flex-wrap gap-4">
                        {#if !user.private}
                            {#each filteredProfiles as profile (profile.id)}
                                <a href={`/user/${profile.username}`} class="flex p-4 rounded shadow-xl mb-4 items-center ring ring-neutral w-full sm:w-64 ">
                                    <img class="w-16 h-16 notfound rounded-full ring ring-neutral" src={profile.avatar_url} alt={profile.display_name} />
                                    <div class="ml-3">
                                        <p class="text-start">{profile.display_name}</p>
                                        <p class="text-gray-500">@{profile.username}</p>
                                        <p class="mt-1 text-cyan-400">
                                            {calculateDaysAgo(profile.logged_at) === 1
                                                ? 'Online'
                                                : 'Offline'}
                                                <!-- : `Last online ${calculateDaysAgo(profile.logged_at)} days ago` -->
                                    </p>
                                </a>
                            {/each}
                            {:else}
                        <div class="stat">
                            <div class="stat-title">This user has private profile</div>
                        </div>
                        {/if}
                    </div>                
                </div>
            </div>
        </div>
    </div>
</div>
{:else}
<Loading />
{/if}

