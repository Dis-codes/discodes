<script lang="ts">
    import Changelog from './changelog/+page.svelte';
    import NavBar from '$lib/components/NavBar.svelte';
    import { user } from '$lib/firebase';
  </script>

<NavBar/>
<div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-3xl font-bold underline text-[45px] mb-2">DisCodes</h1>
    <h3 class="text-center font-bold mt-4 mb-2">The best place for your discord bot</h3>
    {#if $user}
    <a class="btn btn-accent" href="/dashboard">Open</a>
    {:else}
    <a class="btn btn-accent" href="/login">Let's go!</a>
    {/if}
    <div class="py-10" />
    <Changelog />
  </div>