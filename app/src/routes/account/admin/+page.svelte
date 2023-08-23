<script>
    import { user } from "$lib/userStore";
    import { NavBar, Loading, RoleCheck} from "$lib/components/Components";
    export let data
    let { supabase, session } = data
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
async function sendNewLog() {
    const title = document.getElementById('titleInput').value;
    const description = document.getElementById('descriptionInput').value;
    const tags = document.getElementById('tagsInput').value.split(',').map(tag => tag.trim());
    const image = document.getElementById('imageInput').value;
    if (!title || !description || !tags) {
        alert('Please fill in all fields');
        return;
    }
    const { data, error } = await supabase
        .from('changelog')
        .insert([
            { user_id: $user.id, title, description, image, tags },
        ])
        .select();
}

   
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
            <button class="btn btn-sm btn-info  btn-outline shadow-xl">View reports</button>
            {/if}
            <div class="divider"></div>
            </h2>
            <div class="flex justify-center"><h2 class="text-xl font-semibold">Admin's Tools</h2></div>
            <div class="mt-4">
                <button on:click={() => window.changelogModal.showModal()} class="btn btn-accent btn-outline shadow-xl">Send changelog</button>
                <button class="btn btn-success btn-outline shadow-xl">Send Custom Message</button>
                <button class="btn btn-error btn-outline shadow-xl">Force Update Website</button>
            </div>
        </div>
    {:else}
    <Loading />
    {/if}
</main>
</RoleCheck>
<dialog id="changelogModal" class="modal">
    <form method="dialog" class="modal-box">
        <h3 class="font-bold text-xl">Sending a changelog</h3>
        <input id="titleInput" type="text" placeholder="Title" class="input input-bordered w-full max-w-xs" />
        <input id="descriptionInput" type="text" placeholder="Description" class="input input-bordered w-full max-w-xs" />
        <input id="tagsInput" type="text" placeholder="Tags, separate by comma" class="input input-bordered w-full max-w-xs" />
        <input id="imageInput" type="text" placeholder="Image URL" class="input input-bordered w-full max-w-xs" />
        <div class="modal-action">
            <button class="btn btn-error btn-outline" on:click={sendNewLog} type="button">Send</button>
            <button class="btn">Close</button>
        </div>
    </form>
</dialog>
