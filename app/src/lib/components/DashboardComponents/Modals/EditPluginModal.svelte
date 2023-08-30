<script lang="ts">
    export let marketplace:any
    export let getCommands:any
    export let pluginName:string
    export let pluginDescription:string
    export let pluginID:string
    // import { Loading } from '$lib/components/Components';

</script>

<dialog id="editPluginModal" class="modal modal-bottom sm:modal-middle text-center">
    <form method="dialog" class="modal-box" on:submit={(e) => {marketplace(new FormData(e.currentTarget).get('name'),new FormData(e.currentTarget).get('description'), new FormData(e.currentTarget).get("id"))}}>
        <h3 class="font-bold text-lg">Name your comand</h3>
        <input name="name" type="text" value={pluginName} class="input input-bordered w-full max-w-xs my-4" />
        <h3 class="font-bold text-lg">Add a description</h3>
        <input name="description" type="text" value={pluginDescription} class="input input-bordered w-full max-w-xs my-4" />
        <input name="id" type="hidden" value={pluginID}  />
        <div class="modal-action">
        <button type="submit" class="btn btn-success">Edit command</button>
        <button class="btn">Cancel</button>
    </div>
    </form>
</dialog>