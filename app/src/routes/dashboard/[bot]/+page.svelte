<script lang="ts">
    import { NavBar, AuthCheck, TokenModal, EditToken, DeleteToken, BotUptime, CommandStats, EditPluginModal, Loading, BotProfile, AddPluginModal, InvalidToken } from "$lib/components/Components";
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
    let editPlugin = async (name:string, description:string, id:string) => {
        if (!name || !description || !id) return
        const {data, error} = await supabase.from('marketplace').select('*').eq('user_id', $user?.id)
        if (data.length > 0 && id != "Create new") {
            let {data:dat, error:er} =  await supabase.from('marketplace').update({
                name: name,
                description: description,
                user: $user?.user_metadata.full_name
            }).eq('id', id).select()
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

    let currentPluginName:string;
    let currentPluginDescription:string;
    let currentPluginID:string;
    let pluginData:any ;

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
</script>

<AuthCheck>
    <NavBar/>
    <div  class="flex justify-center items-center h-screen">
        <div style="height: 600px;" class="shadow-xl border border-neutral mx-10 mt-28 mb-20 rounded-xl">
        {#if botToken }
        <div class="flex">
        <div class="flex flex-col mt-5 w-96">
            {#await getBot(localStorage.getItem('botToken'))}
                <Loading/>
            {:then result } 

                <BotProfile botObject={result.data}/>
               <div class="flex flex-row justify-center gap-4 mt-3"> 
                <button class="btn btn-neutral" on:click={() => {tokenModal2.showModal()}}>Edit bot token</button>
                <button class="btn btn-error" on:click={() => {tokenModal3.showModal()}}>Delete Token</button>
                </div>

                <div class="mx-5 mt-6">
                <p class="font-bold text-xl">Bot stats:</p>
                
                <div style="width: 200px;" class="border border-neutral shadow-xl rounded-lg p-4 mt-5 h-32 ">
                <p class="font-semibold">Guilds: {result.data.approximate_guild_count}</p>
                <p class="text-info">Bot is {result.data.bot_public ? "public" : "private"}</p>
                <p class="font-semibold">Owned by {result.data?.team?.members ? result.data.team.members[0].user.username : result.data.owner.username}</p>
                </div>
                <p class="font-bold text-xl mt-5">Description:</p>
                <div class="mt-2 ml-2 text-neutral-400">
                {result.data.description} 
                </div>
            </div>
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
        <div style="height: 600px;" class="flex-1 flex flex-col w-1/4 p-6 border border-neutral rounded-xl mt-9 mr-10">
            <h1 class="text-3xl font-bold">Commands</h1>
            <div class="flex-1 p-6 shadow-xl rounded-lg flex h-full overflow-auto scroll-container">
                
                {#if commands.length == 0}
                <p class="text-lg">You don´t have any commands yet!</p>
                {:else}
                <div class="grid grid-cols-4 gap-5">
                {#each commands as command}
                    <div class="w-full">
                        <div class="border border-neutral rounded-xl">
                            <!-- Info content -->
                            <figure><img src="https://picsum.photos/575/250" class="rounded-t-xl" alt="" /></figure>
                            <div class="flex-1 p-6 shadow-xl">
                                <a href="/user/{$user?.user_metadata.full_name}/plugins/{command.id}" class="font-bold hover:underline text-xl">{command.name}</a>
                                <p class="text-neutral-500 ">{command.description}</p>
                                <div class="flex justify-between items-end">
                                    <p class="text-sm font-semibold mt-2  text-cyan-400">{((new Date(command.created_at)).toLocaleDateString('en-GB'))}</p>
                                    <button on:click={(e) => {editPluginModal.showModal(), currentPluginName = command.name, currentPluginDescription = command.description, currentPluginID = command.id }} class="btn btn-neutral mt-3">Edit</button>  
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
                </div>
                {/if}
            </div>
            <button class="btn btn-neutral mt-5 ml-auto" on:click={() => {createPluginModal.showModal()}}>New command</button>
        </div>
        {/await}
    </div>
</AuthCheck>


<InvalidToken/>
<EditPluginModal marketplace={editPlugin} getCommands={getCommands} pluginName={currentPluginName} pluginDescription={currentPluginDescription} pluginID={currentPluginID}/>
<AddPluginModal marketplace={createPLugin}/>
<EditToken tokenFunction={checkToken}/>
<DeleteToken deleteToken={deleteToken}/>
<TokenModal tokenFunction={checkToken}/>

<style>
     .scroll-container {
      max-height: 50vh;
      overflow-y: auto;
  
      scrollbar-width: thin;
      scrollbar-color: transparent  rgb(110, 110, 110);
  
      &::-webkit-scrollbar {
        width: 8px;
      }
  
      &::-webkit-scrollbar-thumb {
        background-color:  rgb(110, 110, 110);
        border-radius: 4px;
      }
  
      &::-webkit-scrollbar-track {
        background-color: transparent;
      }
    }
</style>