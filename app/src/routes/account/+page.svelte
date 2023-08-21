<script lang="ts">
    import { user } from "$lib/userStore";
    import { NavBar, Loading, AuthCheck } from "$lib/components/Components";
    let maxChars = 100;
    let bio = "User of DisCodes";



</script>

<AuthCheck>
<NavBar/>
<main class="flex items-center justify-center h-screen shadow-xl">
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
            <div class="form-control relative">
                <textarea class="textarea h-28 textarea-ghost mb-2 shadow-sm" 
                placeholder="Bio" 
                style="resize: none;" 
                maxlength="100"
                bind:value={bio}></textarea>
 <div class="absolute bottom-2 right-2 text-gray-500 text-sm">{maxChars - bio.length} / {maxChars}</div>
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
              <div class="flex justify-center"><button class="btn btn-accent btn-outline shadow-xl btn-sm">Update profile <span class="material-symbols-outlined">
                done
                </span></button></div>
              <div class="divider"></div>
              <div class="flex justify-center"><button class="btn btn-outline btn-error btn-neutral">Delete your account</button></div>
        </div>
    {:else}
   <Loading />
    {/if}
</main>
</AuthCheck>
