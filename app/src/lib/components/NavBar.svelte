<script lang="ts">
    import Account from "./Account.svelte";
    import { user } from '$lib/userStore';
</script>


<div class="navbar bg-base-200 fixed">
    <div class="flex-none">
    </div>
    <div class="flex-1">
        <a href="/" class="btn btn-square btn-ghost">
            <img src="/Images/favicon1.png" alt="Profile Picture" class="w-full h-full rounded" />
        </a>
    <h2 class="ml-4 normal-case text-xl">DisCodes</h2>
    </div>
    <div class="flex-none">
            {#if $user}
            <a class="btn btn-ghost normal-case" href="/dashboard">Dashboard</a>
            <Account />
            {:else}
            <a class="btn btn-ghost normal-case" href="/login">Log In</a>
            {/if}
    </div>
</div>