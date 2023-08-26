<script lang="ts">
    import { NavBar,AuthCheck, BotUptime, CommandStats } from "$lib/components/Components";
    import BotProfile from "$lib/components/DashboardComponents/BotProfile.svelte";
    import Loading from "$lib/components/MiscComponents/Loading.svelte";
    import { onMount } from "svelte";

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



</script>

<AuthCheck>
    <NavBar/>
    <div class="flex justify-center items-center h-screen">
        {#if botToken }
        <div class="flex flex-col">
            {#await getBot(localStorage.getItem('botToken'))}
                <Loading/>
            {:then result } 
                <BotProfile botObject={result.data}/>
            {/await}

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

<!-- <BotUptime/>
<CommandStats/> -->
    </div>
</AuthCheck>