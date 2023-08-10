<script lang='ts'>
    import { goto } from "$app/navigation";
    import { user } from "$lib/firebase";

    function redirectToLogin() {
        
    }
</script>

{#if $user}
    <slot/>
{:else}
{goto('/errors/login')}
{/if}