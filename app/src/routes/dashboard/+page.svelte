<script lang="ts">
    import { NavBar,AuthCheck } from "$lib/components/Components";
    import BotUptime from "$lib/components/DashboardComponents/BotUptime.svelte";
    import CommandStats from "$lib/components/DashboardComponents/CommandStats.svelte";
    import { onMount } from "svelte";

    let preToken: string;
    let botToken: string;
    let debounceTimer: NodeJS.Timeout;

    onMount(() => {
        botToken = localStorage.getItem('botToken')
    })
</script>

<AuthCheck>
    <NavBar/>
    <div class="flex justify-center items-center h-screen">
        {#if botToken }
            <!-- Nothing here yet-->
        {:else}
        <div class="flex flex-col">
            <p class="text-lg">Looks like you currently have no bot added, press this button to add one :</p>

            <button class="btn btn-neutral mx-auto mt-2" on:click={() => {tokenModal.showModal()}}>Add bot token</button>

            <dialog id="tokenModal" class="modal modal-bottom sm:modal-middle text-center">
                <form method="dialog" class="modal-box">
                    <h3 class="font-bold text-lg">Enter your bot token here</h3>
                    <input type="text" class="rounded mt-4" bind:value={botToken}/>
                    <p class="pt-6 text-error text-xl">WARNING!</p>
                    <p class=" text-error"> your token is extremely secret, do not share it to people you don't trust!</p>
                    <div class="modal-action">
                    <button class="btn btn-success">Enter Token</button>
                    </div>
                </form>
            </dialog>
        </div>
        {/if}
<!-- <BotUptime/>
<CommandStats/> -->
    </div>
</AuthCheck>