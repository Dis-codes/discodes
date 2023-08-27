<script lang="ts">
    export let tokenFunction:any
</script>

<dialog id="tokenModal" class="modal modal-bottom sm:modal-middle text-center">
    <form method="dialog" class="modal-box" on:submit={(e) => {tokenFunction(new FormData(e.currentTarget).get('bot-token'))}}>
        <h3 class="font-bold text-lg">Enter your bot token here</h3>
        <input name="bot-token" type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs mt-4" />
        <p class="pt-6 text-error text-xl">WARNING!</p>
        <p class=" text-error"> your token is extremely secret, do not share it to people you don't trust!</p>
        <div class="modal-action">
        <button type="submit" class="btn btn-success">Enter Token</button>
        <button class="btn">Cancel</button>
        </div>
    </form>
</dialog>