<script lang="ts">
    import { NavBar, Loading } from '$lib/components/Components';
    import { supabase } from '$lib/supabase';
    import { onMount } from 'svelte';

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

        filteredProfiles= profiles.filter(profile => user.following.includes(profile.id));
            
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
<div class="flex items-center justify-center h-screen mx-10">
    <!-- Left Screen (User Profile) -->
    <div class="ml-4 w-full">
        <div class="flex-1 flex flex-col border border-neutral rounded-xl mb-4">
            <!-- Info content -->
            <div class="flex-1 p-6 shadow-xl">
                <h1 class="text-4xl font-bold mb-5">{user.username} is following:<br></h1>
                <div class="ml-6">
                    <div class="stats stats-horizontal mt-3">
                        {#if !user.private}
    <div class="grid grid-cols-2 gap-4">
        <div class="col-span-1">
            {#each filteredProfiles as profile (profile.id)}
                <a href={`/user/${profile.username}`} class="block p-4 bg-white rounded shadow-md mb-4">
                    <img class="w-16 h-16 rounded-full mx-auto" src={profile.avatar_url} alt={profile.display_name} />
                    <p class="text-center mt-1">{profile.display_name}</p>
                    <p class="text-center mt-2 text-gray-500">@{profile.username}</p>
                    <p class="text-center mt-1 text-cyan-400">
                        {calculateDaysAgo(profile.logged_at) === 1
                            ? 'Online'
                            : `Last online ${calculateDaysAgo(profile.logged_at)} days ago`}
                    </p>
                </a>
            {/each}
        </div>
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
