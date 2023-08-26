<script lang="ts">
    import { NavBar,AuthCheck, BotUptime, CommandStats } from "$lib/components/Components";
    import BotProfile from "$lib/components/DashboardComponents/BotProfile.svelte";
    import Loading from "$lib/components/MiscComponents/Loading.svelte";
    import { onMount } from "svelte";
    import { user } from "$lib/stores";

    export let data
    const { supabase } = data

    let botInfo: object;
    let tokenInvalid: boolean;
    let botToken: boolean;
    const tokenRegex = /(mfa\.[\w-]{84}|[\w-]{24}\.[\w-]{6}\.[\w-]{27})/;
    let debounceTimer: NodeJS.Timeout;


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
        return await response.json()
    }

    async function checkToken(token:any) {
            if(tokenRegex.test(token)) {
                botToken = true;
                tokenInvalid = false;
                localStorage.setItem('botToken', token)
                botInfo =  await getBot(token)
            } else{
                botToken = false;
                tokenInvalid = true;
            }
    }


    function deleteToken() { 
        localStorage.removeItem('botToken')
        botToken = false;
    }

    let pluginData:any ;

    let marketplace = async (name:string, description:string) => {
        const {data, error} = await supabase.from('marketplace').select('*').eq('user_id', $user?.id).eq('name', name)
        console.log(data)
        if (data && data?.length > 0) {
            let {data, error} =  await supabase.from('marketplace').update({
                user_id: $user?.id,
                name: name,
                description: description,
                user: $user?.user_metadata.full_name
            })
            pluginData = data
            window.location.href = '/dashboard'
            return [...pluginData]

        } else  {
            let {data, error} =  await supabase.from('marketplace').insert({
                user_id: $user?.id,
                name: name,
                description: description,
                user: $user?.user_metadata.full_name
            })
            pluginData = data
            window.location.href = '/dashboard'
            return [...pluginData]
    }
}


    let getCommands = async () => {
        const { data, error} = await supabase.from('marketplace').select('*').eq('user_id', $user?.id);
        return data;
    }

</script>

<AuthCheck>
    <NavBar/>
    <div class="flex justify-center items-center h-screen">
        <div class="">
        {#if botToken }
        <div class="flex flex-col">
            {#await getBot(localStorage.getItem('botToken'))}
                <Loading/>
            {:then result } 
                <BotProfile botObject={result.data}/>
            {/await}
            
        <button class="btn btn-neutral mx-auto mt-2" on:click={() => {createPluginModal.showModal()}}>New command</button>

        <dialog id="createPluginModal" class="modal modal-bottom sm:modal-middle text-center">
            <form method="dialog" class="modal-box" on:submit={(e) => {marketplace(new FormData(e.currentTarget).get('name'),new FormData(e.currentTarget).get('description'))}}>
                <h3 class="font-bold text-lg">Name your new comand</h3>
                <input name="name" type="text" class="rounded mt-4"/>
                <h3 class="font-bold text-lg">Add a description</h3>
                <input name="description" type="text" class="rounded mt-4"/>
                <div class="modal-action">
                <button type="submit" class="btn btn-success">Create command</button>
                </div>
            </form>
        </dialog>

        <button class="btn btn-neutral mx-auto mt-2" on:click={() => {tokenModal2.showModal()}}>Edit bot token</button>

        <dialog id="tokenModal2" class="modal modal-bottom sm:modal-middle text-center">
            <form method="dialog" class="modal-box" on:submit={(e) => {checkToken(new FormData(e.currentTarget).get('bot-token'))}}>
                <h3 class="font-bold text-lg">Enter your bot token here</h3>
                <input name="bot-token" type="text" class="rounded mt-4"/>
                <p class="pt-6 text-error text-xl">WARNING!</p>
                <p class=" text-error"> your token is extremely secret, do not share it to people you don't trust!</p>
                <div class="modal-action">
                <button type="submit" class="btn btn-success">Edit Token</button>
                </div>
            </form>
        </dialog>
        
        <button class="btn btn-error mx-auto mt-2" on:click={() => {tokenModal3.showModal()}}>Delete Token</button>

        <dialog id="tokenModal3" class="modal modal-bottom sm:modal-middle text-center">
            <form method="dialog" class="modal-box" on:submit={() => {deleteToken()}}>
                <p class="pt-6 text-error text-xl">WARNING!</p>
                <p class=" text-error"> are you sure you want to delete your token?</p>
                <div class="modal-action">
                <button type="submit" class="btn btn-error">Delete Token</button>
                </div>
            </form>
        </dialog>
        </div>
        {#if tokenInvalid === true}
            <p class=" text-error text-center mt-2">The entered token is invalid, please try again</p>
        {/if}
        


        {:else}
        <div class="flex flex-col">
            <p class="text-lg">Looks like you currently have no bot added, press this button to add one :</p>

            <button class="btn btn-neutral mx-auto mt-2" on:click={() => {tokenModal.showModal()}}>Add bot token</button>

            <dialog id="tokenModal" class="modal modal-bottom sm:modal-middle text-center">
                <form method="dialog" class="modal-box" on:submit={(e) => {checkToken(new FormData(e.currentTarget).get('bot-token'))}}>
                    <h3 class="font-bold text-lg">Enter your bot token here</h3>
                    <input name="bot-token" type="text" class="rounded mt-4"/>
                    <p class="pt-6 text-error text-xl">WARNING!</p>
                    <p class=" text-error"> your token is extremely secret, do not share it to people you don't trust!</p>
                    <div class="modal-action">
                    <button type="submit" class="btn btn-success">Enter Token</button>
                    </div>
                </form>
            </dialog>

            {#if tokenInvalid === true}
                <p class=" text-error text-center mt-2">The entered token is invalid, please try again</p>
            {/if}
        </div>
        {/if}
    </div>
<!-- <BotUptime/>
<CommandStats/> -->
    
        {#await getCommands()}
            <Loading/>
        {:then commands} 
            <div class=" w-1/4 border-spacing-0.5">
                {#each commands as command}
                <div class='shadow-xl py-16 rounded-lg border mb-4 border-neutral'>
                        <div class="text-center">
                            <a href="/user/{user.username}/plugins/{command.id}" class="font-bold hover:underline text-xl">{command.name}</a>
                            <p class="font">{command.description}</p>
                            <p class="text-sm font-semibold mt-1 text-cyan-400"> {((new Date(command.created_at)).toLocaleDateString('en-GB'))}</p>
                            <button class="btn btn-neutral mt-3">Edit</button>
                    </div>
                </div>
                {/each}
            </div>
        {/await}


    </div>
    


    
</AuthCheck>