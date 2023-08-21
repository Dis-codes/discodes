<script lang="ts">
    import { onMount } from 'svelte';
    export let data
let { supabase, session } = data
$: ({ supabase, session } = data)
onMount(() => {
    if (session && session.user) {
        window.location.href = `https://workspace.discodes.xyz?session_key=${encodeURIComponent(JSON.stringify(session))}`
}
});
</script>
{#if !session?.user}
<div class='flex justify-center items-center h-screen'>
    <div class="card w-96 bg-base-100 shadow-xl ">
        <figure class="px-10 pt-10">
            <img src=".../../../../Gifs/itsfine.gif" alt="gif" class="rounded-xl" />
        </figure>
        <div class="card-body items-center text-center">
            <h2 class="card-title">Ou oh, you aren´t logged in!</h2>
            <p class='text-secondary'>If you want to access the workspace please login</p>
            <div class="card-actions">
                <a class="btn btn-secondary" href="/">Go back to the landing page</a>
            </div>
        </div>
    </div>
</div>
{/if}