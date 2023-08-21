<script>
    import { user } from "$lib/userStore";
    import { supabase } from '$lib/supabase';
    import { NavBar, Loading, RoleCheck} from "$lib/components/Components";

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

<RoleCheck roleID={'1138771459938988052'} userID={$user?.user_metadata.provider_id}>
<NavBar/>
<main class="flex items-center justify-center h-screen mx-10">
    {#if $user}
        <div class="p-6 shadow-xl rounded-lg border border-neutral">
            <div class="flex justify-center"><h1 class="text-3xl font-bold">Admin's Headquarters</h1></div>
            <div class="divider"></div>
            <h2 class="text-xl font-semibold">Welcome back {$user.user_metadata.full_name}!</h2>
            <p class="text-gray-500 mb-6">You are logged in as an admin.</p>

            
            <h2 class="text-xl font-semibold">Registered users:
            {info.registeredUsers}
            </h2>
            <h2 class="text-xl font-semibold">Reports: <span>{info.reports}</span>
            {#if info.reports > 0 }
            <button class="btn btn-sm btn-info  btn-outline">View reports</button>
            {/if}
            <div class="divider"></div>
            </h2>
            <div class="flex justify-center"><h2 class="text-xl font-semibold">Admin's Tools</h2></div>
            <div class="mt-4">
                <button class="btn btn-accent btn-outline">Send changelog</button>
                <button class="btn btn-success btn-outline">Send Custom Message</button>
                <button class="btn btn-error btn-outline">Force Update Website</button>
            </div>
        </div>
    {:else}
    <Loading />
    {/if}
</main>
</RoleCheck>