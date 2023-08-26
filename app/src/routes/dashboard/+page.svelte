<script lang="ts">
    import { NavBar,AuthCheck, BotUptime, CommandStats } from "$lib/components/Components";
    import { onMount } from "svelte";

    let tokenInvalid: boolean;
    let botToken: boolean;
    const tokenRegex = /(mfa\.[\w-]{84}|[\w-]{24}\.[\w-]{6}\.[\w-]{27})/;
    let debounceTimer: NodeJS.Timeout;

    onMount(() => {
        botToken = localStorage.getItem('botToken')
    })

    async function checkToken(token:any) {
            if(tokenRegex.test(token)) {
                botToken = true;
                tokenInvalid = false;
                localStorage.setItem('botToken', token)
                const response = await fetch(`https://discord.com/api/oauth2/applications/@me`, {
                    headers: {
                        'Authorization': `Bot ${token}`,
                    }
                });
                console.log(response)
            } else{
                botToken = false;
                tokenInvalid = true;
            }
    }






</script>

<AuthCheck>
    <NavBar/>
    <div class="flex justify-center items-center h-screen">
        {#if botToken }
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