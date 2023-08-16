<script lang="ts">
//supabase is not defined..
    async function signout() {
    const { error } = await supabase.auth.signOut()
    if (error) console.log('Error logging out:', error.message)
}
</script>



<button class="btn btn-neutral" on:click={() => window.logoutModal.showModal()}>Log Out</button>
<dialog id="logoutModal" class="modal">

    <form method="dialog" class="modal-box">
        <h3 class="font-bold text-xl">Log out?</h3>
        <p class="py-4 text-lg">Are you sure you want to log out?</p>
        <p class="text-warning text-lg">All Unsaved data will be lost!</p>
        <div class="modal-action">
        <!-- if there is a button in form, it will close the modal -->
            <button class="btn btn-error" on:click={() => {signout()}}>Log Out</button>
            <button class="btn">Cancel</button>
        </div>
    </form>
</dialog>