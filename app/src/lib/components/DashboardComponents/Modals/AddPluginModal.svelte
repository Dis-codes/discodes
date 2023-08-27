<script lang="ts">
    export let marketplace:any;
</script>

<dialog id="createPluginModal" class="modal modal-bottom sm:modal-middle text-center">
    <form method="dialog" class="modal-box" on:submit={(e) => {marketplace(new FormData(e.currentTarget).get('name'),new FormData(e.currentTarget).get('description'))}}>
        <h3 class="font-bold text-lg">Name your new comand</h3>
        <input name="name" type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs my-4" />
        <h3 class="font-bold text-lg">Add a description</h3>
        <input name="description" type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs my-4" />
        <div class="modal-action">
        <button type="submit" class="btn btn-success">Create command</button>
        <button class="btn">Cancel</button>
    </div>
    </form>
</dialog>