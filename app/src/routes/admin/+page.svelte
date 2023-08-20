<script>
    import { user } from "$lib/userStore";
    import NavBar from '$lib/components/NavBar.svelte';
    import { supabase } from '$lib/supabase';
    import Loading from '$lib/components/Loading.svelte';

    let info = {
        registeredUsers: "loading...",
        reports: 3,
    }
    
    let Users = async () => {
    const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
    
        if (profilesData) {
        info.registeredUsers = profilesData.length;
        }
}

Users();


   
</script>

<NavBar/>
<main class="flex items-center justify-center h-screen">
    {#if $user}
        <div class="p-6 shadow rounded-lg border">
            <div class="flex justify-center"><h1 class="text-2xl font-semibold">Admin's Headquarters</h1></div>
            <div class="divider"></div>
            <h2 class="text-xl font-semibold">Welcome back {$user.user_metadata.full_name}!</h2>
            <p class="text-gray-500">You are logged in as an admin.</p>
            <div class="divider"></div>
            
            <h2 class="text-xl font-semibold">Registered users:
            {info.registeredUsers}
            </h2>
            <h2 class="text-xl font-semibold">Reports: <span>{info.reports}</span>
            {#if info.reports > 0 }
            <button class="btn btn-sm btn-outline">View reports</button>
            {/if}
            </h2>
            <div class="flex justify-center"><h2 class="text-xl font-semibold">Admin's Tools</h2></div>
            <div class="mt-4">
                <button class="btn">Send changelog</button>
                <button class="btn">Force Update Website</button>
                <button class="btn">Send Custom Message</button>
            </div>
        </div>
    {:else}
    <Loading />
    {/if}
</main>