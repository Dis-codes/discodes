<script lang='ts'>
    export let roleID:string;
    export let userID:any;

    import { goto } from "$app/navigation";
    import { GetUserRoles } from 'discodes-utilities';
    import Loading from "./Loading.svelte";
    import { user } from '$lib/stores';
    let discordUser:any = $user? GetUserRoles(userID) : null;
</script>


{#await discordUser}
    <Loading/>
{:then roles} 
{#if !roles}
{ goto('/errors/login')}
{:else if roles && roles.includes(roleID)}
    <slot/>
{:else}
{ goto('/errors/permission')}
{/if}
{/await}

