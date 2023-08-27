<script lang="ts">
    import { NavBar,AuthCheck, BotUptime, CommandStats } from "$lib/components/Components";
    import BotProfile from "$lib/components/DashboardComponents/BotProfile.svelte";
    import Loading from "$lib/components/MiscComponents/Loading.svelte";
    import { onMount } from "svelte";
    import { user } from "$lib/stores";

    export let data
    const { supabase } = data

    let botToken: boolean;


    onMount(() => {
        botToken = localStorage.getItem('botToken')
    })

    async function getBot(token:string) {
        const response = await fetch(`/api/v1/discord/bot`, {
            method: "POST",
            mode: "cors",
            body: JSON.stringify({
                token: token
            })
        });
        if (!response.ok) {
            botTokenInvalid.showModal()
            return null
        }
        const json = await response.json()
        if (json.data.id != window.location.pathname.split('/')[2]) {
            botToken=false
            return null
        }
        return json
    }
    let marketplace = async (name:string, description:string, selection:string) => {
        if (!name || !description || !selection) return
        const {data, error} = await supabase.from('marketplace').select('*').eq('user_id', $user?.id)
        if (data.length > 0 && selection != "Create new") {
            let {data:dat, error:er} =  await supabase.from('marketplace').update({
                name: name,
                description: description,
                user: $user?.user_metadata.full_name
            }).eq('id', selection).select()
          return  window.location.reload()
        }
            if (data.filter((e:any) => e.name == name).length > 0) {
                alert("You already have a command with that name!")
                return
            }
             await supabase.from('marketplace').insert({
                user_id: $user?.id,
                name: name,
                description: description,
                user: $user?.user_metadata.full_name
            })
            window.location.reload()
    
}
let commands:any;
let getCommands:any = async () => {
        const { data, error} = await supabase.from('marketplace').select('*').eq('user_id', $user?.id);
        commands = data
        return data;
    }
</script>

<AuthCheck>
    <NavBar/>
    <div class="flex justify-center items-center h-screen">
        <div class="">
        {#if botToken }
        <div class="flex gap-20">
        <div class="flex flex-col">
            {#await getBot(localStorage.getItem('botToken'))}
                <Loading/>
            {:then result } 
                <BotProfile botObject={result.data}/>
                <h2>Bot stats</h2>
                <p>Guilds: {result.data.approximate_guild_count}</p>
                <p>Bot is {result.data.bot_public ? "public" : "private"}</p>
                <p>description: {result.data.description}</p>



            {/await}
       
    </div>
    <div>
    </div>
        </div>
        {:else}
        <div class="flex flex-col">
            <p class="text-lg">Looks like this bot doesn´t exists!</p>

            <a href="/dashboard" class="btn btn-neutral mx-auto mt-2">Go back</a>

            
        </div>
        {/if}
    </div>
<!-- <BotUptime/>
<CommandStats/> -->
    
        {#await getCommands()}
            <Loading/>
        {:then commands} 
            <div class=" w-1/4 border-spacing-0.5">
                {#if commands.length == 0}
                <p class="text-lg">You don´t have any commands yet!</p>
                <!-- svelte-ignore missing-declaration -->
                <button on:click={() => {EditPluginModal.showModal()}} class="btn btn-neutral mt-3">Create one</button>
                {/if}
                {#each commands as command}
                <div class='shadow-xl py-2 rounded-lg border mb-4 border-neutral'>
                        <div class="text-center">
                            <a href="/user/{$user?.user_metadata.full_name}/plugins/{command.id}" class="font-bold hover:underline text-xl">{command.name}</a>
                            <p class="font">{command.description}</p>
                            <p class="text-sm font-semibold mt-1 text-cyan-400"> {((new Date(command.created_at)).toLocaleDateString('en-GB'))}</p>
                            <!-- svelte-ignore missing-declaration -->
                            <button on:click={() => {EditPluginModal.showModal()}} class="btn btn-neutral mt-3">Edit</button>
                    </div>
                </div>
                {/each}
            </div>
        {/await}


    </div>
</AuthCheck>

<dialog id="EditPluginModal" class="modal modal-bottom sm:modal-middle text-center">
    <form method="dialog" class="modal-box" on:submit={(e) => {marketplace(new FormData(e.currentTarget).get('name'),new FormData(e.currentTarget).get('description'),new FormData(e.currentTarget).get('selection'))}}>
        <h3 class="font-bold text-lg">Name your new comand</h3>
        <input name="name" type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs my-4" />
        <h3 class="font-bold text-lg">Add a description</h3>
        <input name="description" type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs my-4" />
        <select name="selection" class="select select-bordered w-full max-w-xs">
            <option disabled selected>Which Command to edit?</option>
            {#await getCommands()}
            <Loading/>
        {:then commands} 
            {#each commands as command}
            <option value={command.id}>{command.name}</option>
            {/each}
            {/await}
            <option>Create new</option>
          </select>
        <div class="modal-action">
        <button type="submit" class="btn btn-success">Edit command</button>
        <button class="btn">Cancel</button>
    </div>
    </form>
</dialog>