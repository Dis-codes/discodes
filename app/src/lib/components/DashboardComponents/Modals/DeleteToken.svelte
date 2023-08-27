<script lang="ts">
    export let deleteToken:any;
</script>

<dialog id="tokenModal3" class="modal modal-bottom sm:modal-middle text-center">
    <form method="dialog" class="modal-box" on:submit={() => {deleteToken()}}>
        <p class="pt-6 text-error text-xl">WARNING!</p>
        <p class=" text-error"> are you sure you want to delete your token?</p>
        <div class="modal-action">
        <button type="submit" class="btn btn-error">Delete Token</button>
        <button class="btn">Cancel</button>
        </div>
    </form>
</dialog>