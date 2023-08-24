<script lang="ts">
    import { NavBar, Changelog } from "$lib/components/Components";

    export let data
    let { supabase, session } = data
    $: ({ supabase, session } = data)

    const handleSignIn = async () => {
        await supabase.auth.signInWithOAuth({
            provider:'discord',
            options: {
                redirectTo:`${location.origin}/auth/callback`
            }
        })
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
    }
</script>


<NavBar>
    <button on:click="{handleSignIn}" class="btn btn-ghost">
        Log In
    </button>
</NavBar>
<div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-3xl font-bold text-[60px] mb-2 text-discodes-purple-light">DisCodes</h1>
    <h3 class="text-center font-bold mt-4 mb-4">The best place for your discord bot</h3>
    {#if session?.user}
    <a class="btn btn-accent" href="/dashboard">Open dashboard</a>
    {:else}
    <button class="btn btn-accent" on:click="{handleSignIn}">Let's begin!</button>
    {/if}
    <div class="py-10" />
    <Changelog />
</div>
