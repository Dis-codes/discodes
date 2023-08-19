<script lang="ts">
    import {user } from "$lib/userStore";
    import NavBar from '$lib/components/NavBar.svelte';
    import AuthCheck from "$lib/components/AuthCheck.svelte";

</script>

<AuthCheck>
<NavBar/>
<main class="flex items-center justify-center h-screen">
    {#if $user}
        <div class="p-6 shadow rounded-lg border">
            <div class="flex justify-center"><h1 class="text-2xl font-semibold">Account Information</h1></div>
            <div class="divider"></div>
            <div class="flex items-center">
                <img src={$user?.user_metadata.avatar_url} alt={"Profile Picture of " + ($user ? $user.user_metadata.full_name : "User")} class="w-16 h-16 rounded-full mr-4" />
                <div class="p-4">
                    <h2 class="text-xl font-semibold">{$user?.user_metadata.full_name}</h2>
                    <p class="text-gray-500">{$user?.email}</p>
                </div>
            </div>
                <!-- <p><strong>Account Created:</strong> {$user?.metadata?.creationTime}</p>
                <p><strong>Last Signed In:</strong> {$user?.metadata?.lastSignInTime}</p> -->
            <div class="form-control">
                <label class="label">
                  <span class="label-text">Bio</span>
                </label>
                <textarea class="textarea textarea-bordered h-24 " placeholder="Enter Bio here"></textarea>
              </div>
              <button class="btn btn-accent mt-4" disabled>Publish Bio</button>
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Make profile private and hide activity</span> 
                  <input type="checkbox" class="checkbox" disabled checked />
                </label>
              </div>
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Show Achievements on my profile</span> 
                  <input type="checkbox" class="checkbox" disabled checked />
                </label>
              </div>
              <div class="flex justify-center text-red-400"><h2 class="text-xl font-semibold mt-6">Delete account</h2></div>
              <div class="divider"></div>
              <div class="flex justify-center"><button class="btn btn-outline btn-error btn-disabled">Delete your account</button></div>
        </div>
    {:else}
    <span class="loading loading-spinner text-discodes loading-lg"></span>
    {/if}
</main>
</AuthCheck>
