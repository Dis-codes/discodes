<script lang="ts">
    import Changelog from './changelog/+page.svelte';
  </script>
<div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-3xl font-bold underline text-[25px]">Discodes</h1>
    <h3 class="text-center font-bold">The best place for your discord bot</h3>
    <div class="flex gap-2 mt-4">
        <a href="/login" class="bg-zinc-900 text-white hover:bg-white hover:text-zinc-900 rounded-full px-4 py-1 transition duration-300">Login</a>
        <a href="/register" class="bg-zinc-900 text-white hover:bg-white hover:text-zinc-900 rounded-full px-4 py-1 transition duration-300">New here?</a>
      </div>
    <button class="mt-4 rounded-full bg-blue-500 text-white hover:bg-white hover:text-blue-500 px-4 py-2 transition duration-300">Start</button>
  </div>

  <Changelog />