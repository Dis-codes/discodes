<script lang='ts'>
    import { auth } from "$lib/firebase";
    import { userStore } from 'sveltefire';

    const user = userStore(auth);
</script>

{#if user}
    <slot/>
{:else}
    <p class='text-error'>
        You must be signed in to view this page.
        <a class="btn btn-primary" href="/login">Sign In</a>
    </p>
{/if}