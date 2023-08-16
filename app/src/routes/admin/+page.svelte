<script>
    import { user } from "$lib/userStore";
    import NavBar from '$lib/components/NavBar.svelte';
    import { supabase } from '$lib/supabase';

    
    let registeredUsers = async () => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*');
        return data?.length;
    } catch (error) {
        console.error('Error fetching user count:', error.message);
        return 0; // Return a default value or handle the error as needed
    }
}


    let info = {
        onlineUsers: 1,
        reports: 3,
    }
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
                {#await registeredUsers()}
                <span>Loading..</span>
                {:then resolved}
                <span>{resolved}</span>
                {:catch error}
                <p style="color: red">{error.message}</p>
                {/await}
            </h2>

            <h2 class="text-xl font-semibold">Online users: <span>{info.onlineUsers}</span></h2> 
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
    <span class="loading loading-spinner text-discodes loading-lg"></span>
    {/if}
</main>