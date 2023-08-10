<script lang="ts">
    import { goto } from '$app/navigation';
    import AuthCheck from '$lib/components/AuthCheck.svelte';
    import Changelog from './changelog/+page.svelte';


    import { redirect } from '@sveltejs/kit';

function loginRedirect() {
    goto('/login')
}

  </script>

<div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-3xl font-bold underline text-[45px] mb-2">Discodes</h1>
    <h3 class="text-center font-bold mt-4 mb-2">The best place for your discord bot</h3>
    <button on:click={loginRedirect} class="btn btn-accent">Let's go!</button>
    <div class="py-10" />
    <Changelog />
  </div>