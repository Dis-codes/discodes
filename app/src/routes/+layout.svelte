<script lang="ts">
    import "../app.css";
    import { invalidate } from '$app/navigation';
    import { onMount } from 'svelte';
    import { settings, user } from "$lib/stores";
    import { page } from '$app/stores';

    import RoleCheck from "$lib/components/MiscComponents/RoleCheck.svelte";
    import Loading from "$lib/components/MiscComponents/Loading.svelte";
    import {goto} from "$app/navigation"
   // export let data

    const allowedUrls: Array<string> = ['/errors/permission', '/', '/auth/callback', '/getsession', '/goodbye']
        
    // let { supabase, session } = data
    // $: ({ supabase, session } = data)

    onMount(() => {

        if (!import.meta.env.DEV && $page.url.pathname ===  '/'){
            goto("./errors/maintanance")
        }

        // if (!session?.user) {
        //     if ($page.url.pathname.startsWith("/errors") || allowedUrls.includes($page.url.pathname)) {
        //         return
        //     }
        //     window.location.href = '/errors/login'
        // }
        // const {
        // data: { subscription },
        // } = supabase.auth.onAuthStateChange((event, _session) => {
        // if (_session?.expires_at !== session?.expires_at) {
        //     invalidate('supabase:auth')
        // }
        // })

        //return () => subscription.unsubscribe()
    });
</script>

<svelte:head>
	<title>Discodes</title>
</svelte:head>

{#if typeof window  !== 'undefined'}
<div data-theme={$settings.theme}>
    {#if $page.url.pathname.startsWith("/errors") || allowedUrls.includes($page.url.pathname) }
        <slot />
    {:else}
<RoleCheck roleID={'1144641299748769864'} userID={$user?.user_metadata.provider_id}>
    <div class="min-h-screen flex flex-col">
        <slot/>
    </div>
</RoleCheck>
    {/if}
</div>
{/if}
