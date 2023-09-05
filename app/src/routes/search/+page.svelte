<script lang="ts">
    import { onMount } from 'svelte';
    import { NavBar, Loading } from "$lib/components/Components";
    import { settings } from '$lib/stores';
    export let data
    let { supabase, session } = data
    $: ({ supabase, session } = data)

    let keyword: string = '';
    let selectedOption: string = 'users';
</script>
  
<NavBar />
<div class="flex flex-col justify-center items-center h-screen gap-4">
    <h1 class="text-3xl">Search</h1>
    <div class="flex flex-col md:flex-row gap-4">
    <div class="form-control max-w-xs w-full md:w-fit">
    <label class="label">
        <span class="label-text">type</span>
      </label>
<select class="select select-bordered " bind:value={selectedOption}>
    <option value="users">User</option>
    <option value="marketplace">Marketplace</option>
  </select>
</div>
<div class="form-control max-w-xs w-full md:w-fit">
    <label class="label">
        <span class="label-text">keyword</span>
      </label>
    <input type="text" placeholder="Search" class="input input-bordered max-w-xs w-full" bind:value={keyword} maxlength="32" />
</div>
    <a href="/search/{selectedOption}?keyword={keyword}" class="btn btn-success max-w-xs w-full md:w-fit md:mt-9">Search</a>
</div>
</div>