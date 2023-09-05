<script lang="ts">
    import { NavBar, AuthCheck, TokenModal, EditToken, DeleteToken, BotUptime, CommandStats, Loading, BotProfile, AddPluginModal, InvalidToken } from "$lib/components/Components";
    import { onMount } from "svelte";
    import { user } from "$lib/stores";

    export let data
    const { supabase } = data

    let pluginData:any ;
    let botInfo: object;
    let botToken: boolean;
    const tokenRegex = /(mfa\.[\w-]{84}|[\w-]{24}\.[\w-]{6}\.[\w-]{27})/;


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
        return await response.json()
    }

    async function checkToken(token:any) {
        if (!token) return

        if(!tokenRegex.test(token)) {
            botTokenInvalid.showModal()
            botToken = false;
            return
        }
        botInfo =  await getBot(token)
        if (!botInfo) return;

        botToken = true;
        localStorage.setItem('botToken', token)
    } 

    function deleteToken() { 
        localStorage.removeItem('botToken')
        botToken = false;
    }

    let createPLugin = async (name:string, description:string) => {

        if (!name || !description) return
        const {data, error} = await supabase.from('marketplace').select('*').eq('user_id', $user?.id).eq('name', name)

        if (data && data?.length > 0) {
            console.error('Plugin Already exists')
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
        <div>
        {#if botToken }
        <div class="flex gap-4 md:gap-20 flex-col md:flex-row">
        <div class="flex flex-col">
            {#await getBot(localStorage.getItem('botToken'))}
                <Loading/>
            {:then result } 
                <BotProfile botObject={result.data}/>
            {/await}
            
        <!-- svelte-ignore missing-declaration -->
        <!-- <button class="btn btn-neutral mx-auto mt-2" on:click={() => {createPluginModal.showModal()}}>New command</button> -->
        <!-- svelte-ignore missing-declaration -->
        <!-- <button class="btn btn-neutral mx-auto mt-2" on:click={() => {tokenModal2.showModal()}}>Edit bot token</button> -->
        <!-- svelte-ignore missing-declaration -->
        <!-- <button class="btn btn-error mx-auto mt-2" on:click={() => {tokenModal3.showModal()}}>Delete Token</button> -->

    </div>
    <div>
        <!-- svelte-ignore missing-declaration -->
        <!-- <button >
        <div class=">
            <div class="">
                
            </div>
        </div>
        <p class="text-xl text-center text mt-2">Add New</p>
     </button> -->

     <button on:click={() => {tokenModal.showModal()}}  class="flex flex-row md:flex-col w-52 bg-base-100 shadow-xl border border-neutral rounded-xl h-full">
        <figure class="md:w-28 mx-auto my-4 md:my-0 md:mt-auto flex justify-center w-16 ml-2 md:ml-auto ring rounded-full ring-accent">
            <img src="../../Images/plus.png" alt="bot pfp"/>
        </figure>
        <div class="m-auto">
            <h2 class="text-xl">Add new bot</h2>
        </div>
    </button>

    </div>
        </div>
        {:else}
        <div class="flex flex-col">
            <p class="text-lg">Looks like you currently have no bot added, press this button to add one :</p>
            <!-- svelte-ignore missing-declaration -->
            <button class="btn btn-neutral mx-auto mt-2" on:click={() => {tokenModal.showModal()}}>Add bot token</button> 
        </div>
        {/if}
    </div>

    </div>
</AuthCheck>


<InvalidToken/>
<!-- <AddPluginModal marketplace={marketplace}/> -->
<!-- <EditToken tokenFunction={checkToken}/>
<DeleteToken deleteToken={deleteToken}/> -->
<TokenModal tokenFunction={checkToken}/>
