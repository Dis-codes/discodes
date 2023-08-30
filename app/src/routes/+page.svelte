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

{#if session?.user}
<NavBar>
    <button on:click="{handleSignIn}" class="btn btn-ghost">
        Log In
    </button>
</NavBar>
{/if}
<div class="flex flex-col items-center justify-center">
    <div class="flex flex-row items-center gap-5 sm:gap-10 mt-24 mb-8">
      <figure><img src="../Images/favicon1.png" class="w-16 h-16 sm:w-24 sm:h-24 rounded-full" /></figure>
      <h1 class="font-bold text-4xl sm:text-8xl text-discodes-purple-light">DisCodes</h1>
    </div>
    
    <h3 class="text-center font-bold mb-4">The best place for your discord bot</h3>
    {#if session?.user}
    <a class="btn btn-accent" href="/dashboard">Open dashboard</a>
    {:else}
    <button class="btn btn-accent px-6" on:click="{handleSignIn}">Let's Begin →</button>
    {/if}
    <div class="mb-10" />
    <Changelog />
</div>
