<script lang="ts">
    import {user } from "$lib/userStore";
    import NavBar from '$lib/components/NavBar.svelte';
    import AuthCheck from "$lib/components/AuthCheck.svelte";

</script>

<AuthCheck>
<NavBar/>
<main class="flex items-center justify-center h-screen">
    {#if $user}
        <div class="p-6 shadow-xl border border-neutral rounded-lg ">
            <div class="flex justify-center"><h1 class="text-2xl font-semibold">
              <img src={$user?.user_metadata.avatar_url} 
              alt={"Profile Picture of " + ($user ? $user.user_metadata.full_name : "User")} 
              class="w-16 h-16 rounded-full mr-2 mt-3 border border-neutral"/>
              
            </h1>
            <div class="ml-2" stlye="position:fixed; top: 500px">
              <div class="p-4">
                  <h2 class="text-xl font-semibold">{$user?.user_metadata.full_name}</h2>
                  <p class="text-gray-500">{$user?.email}</p>
              </div>
          </div>
          </div>
            <div class="divider"></div>

                <!-- <p><strong>Account Created:</strong> {$user?.metadata?.creationTime}</p>
                <p><strong>Last Signed In:</strong> {$user?.metadata?.lastSignInTime}</p> -->
            <div class="form-control">
                <textarea class="textarea textarea-ghost" placeholder="Bio"></textarea>
              </div>
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Make profile private</span> 
                  <input type="checkbox" class="checkbox" checked />
                </label>
              </div>
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Show Achievements</span> 
                  <input type="checkbox" class="checkbox" checked />
                </label>
              </div>
              <div class="divider"></div>
              <div class="flex justify-center"><button class="btn btn-outline btn-error btn-neutral">Delete your account</button></div>
        </div>
    {:else}
    <span class="loading loading-spinner text-discodes loading-lg"></span>
    {/if}
</main>
</AuthCheck>
