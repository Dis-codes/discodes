<script lang="ts">
    import Account from "./Account.svelte";
    import { user} from '$lib/stores';
  import { onMount } from "svelte";
    let searchContent = '';
    let isMobile = false;
    let isSearch = true;
    let isDashboard = true;

    onMount(() => {
      isMobile = window.innerWidth < 900;
      isSearch = window.innerWidth < 730;
      isDashboard = window.innerWidth > 470
      window.addEventListener("resize", () => {
        isDashboard = window.innerWidth > 470
        isMobile = window.innerWidth < 900;
        isSearch = window.innerWidth < 730;
      });
    });
  </script>

  <div class="navbar bg-base-200 fixed">
    <div class="flex-1">
      <a href="/" class="btn btn-square btn-ghost">
        <img src="/Images/favicon1.png" alt="Profile Picture" class="w-full h-full rounded" />
      </a>
      <h2 class="ml-4 normal-case text-xl">DisCodes</h2>
    </div>
    <div class="flex-auto">
      <a class="btn {isMobile ? "btn-square btn-sm ml-3" : ""} btn-ghost normal-case no-animation" href="https://workspace.discodes.xyz">
        {#if isMobile}
        <span class="material-symbols-outlined">code_blocks</span>
        {:else}
        Workspace
        {/if}
      </a>      
      <a class="btn btn-ghost {isMobile ? (isSearch ? "square btn-sm" : "btn-square btn-sm") : ""} normal-case no-animation mx-2" href="/discover">
        {#if isMobile}
        <span class="material-symbols-outlined">storefront</span>
        {:else}
        Discover
        {/if}
      </a>
      {#if isSearch}
      <a class="btn btn-ghost btn-square btn-sm normal-case no-animation" href="/search"><span class="material-symbols-outlined">search</span></a>
      {:else}
      <div class="dropdown w-64">
        <input
          type="text"
          placeholder="Search"
          class="input input-bordered input-sm w-full break-keep"
          bind:value={searchContent}
          maxlength="32"
          on:keydown={(event) => {
            if (event.key === "Enter") {
              window.location.href = `/search/users?keyword=${searchContent}`;
            } else if (event.key === "Escape") {
              searchContent = "";
            }
          }}
        />

        {#if searchContent}
        <ul class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-full">
            <li><button on:click={() => window.location.href = `/search/users?keyword=${searchContent}`}>Search <span class="truncate">{searchContent}</span> in people</button></li>
            <li><button on:click={() => window.location.href =`/search/plugins/${searchContent}`}>Search <span class="truncate">{searchContent}</span> in plugins</button></li>
            <li><button on:click={() => window.location.href =`/search/marketplace?keyword=${searchContent}`}>Search <span class="truncate">{searchContent}</span> in marketplace</button></li>
          </ul>
        {/if}
      </div>
      <div style="transform: translate(-3.1rem, -0.2rem); ">
        <kbd class="kbd kbd-xs">enter</kbd>
      </div>
      {/if}
    </div>
    
    <div class="flex-none">
      {#if $user}

        {#if isDashboard}
        <a class="btn btn-ghost normal-case" href="/dashboard">Dashboard</a>
        {/if} 
        <Account />
        
      {:else}
        <slot/>
        <!-- <a class="btn btn-ghost normal-case" href="/login">Log In</a> -->
      {/if}
    </div>
  </div>
  <!-- <div class="mt-16 flex flex-col items-center">

  </div> -->

