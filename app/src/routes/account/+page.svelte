<script lang="ts">
    import { onMount } from 'svelte';
    import { NavBar, Loading, AuthCheck } from "$lib/components/Components";
    let maxChars = 100;
    let profileData = {
    bio: 'Loading...',
    private: false,
    achievements: true,
    pro: false
};
    let isLoading = false;
    let showMessage = false;
    let isSuccess = false;
    let initialProfileData = { ...profileData };
    export let data;
    let { supabase, session } = data;
    $: ({ supabase, session } = data);
    const  user = session?.user;
    const {full_name, avatar_url} = user?.user_metadata;

    onMount(async () => {
      const { data, e } = await supabase
            .from('identity')
            .select('bio, private, achievements, pro')
            .eq('id', user?.id);

        if (e) {
            return;
        }
       profileData = data[0];
       initialProfileData = { ...profileData };

});

async function updateProfile() {
     isLoading = true;
     showMessage = false;
     const hasChanges = JSON.stringify(profileData) !== JSON.stringify(initialProfileData);

    if (!hasChanges) {
      isLoading = false;
      showMessage = true;
      isSuccess = false;
      setTimeout(() => {
        showMessage = false;
      }, 3000)
      return;
    }

    
const { error } = await supabase
  .from('identity')
  .update({ bio: profileData?.bio , private: profileData?.private, achievements: profileData?.achievements, pro: profileData?.pro })
  .eq('id', user?.id)

      isLoading = false;
      if (error){
        showMessage = true;
        isSuccess = false;
        setTimeout(() => {
          showMessage = false;
        }, 3000)
        return;
      }
      initialProfileData = { ...profileData };
      showMessage = true;
      isSuccess = true;
      setTimeout(() => {
        showMessage = false;
      }, 3000)
  }
</script>

<AuthCheck>
<NavBar/>
<main class="flex items-center justify-center h-screen shadow-xl">
    {#if user}
        <div class="p-6 shadow-xl border border-neutral rounded-lg ">
            <div class="flex justify-center"><h1 class="text-2xl font-semibold">
              <img src={avatar_url} 
              alt={"Profile Picture of " + (user ? full_name : "User")} 
              class="w-16 h-16 rounded-full mr-2 mt-3 border border-neutral"/>
              
            </h1>
            <div class="ml-2">
              <div class="p-4">
                  <h2 class="text-xl font-semibold">{full_name}</h2>
                  <p class="text-gray-500">{user?.email}</p>
              </div>
          </div>
          </div>
            <div class="divider"></div>

                <!-- <p><strong>Account Created:</strong> {user?.metadata?.creationTime}</p>
                <p><strong>Last Signed In:</strong> {user?.metadata?.lastSignInTime}</p> -->
            <div class="form-control relative">
                <textarea class="textarea h-28 textarea-ghost mb-2 shadow-sm" 
                placeholder="Bio" 
                style="resize: none;" 
                maxlength="100"
                bind:value={profileData.bio}></textarea>
 <div class="absolute bottom-2 right-2 text-gray-500 text-sm">{maxChars - profileData.bio.length} / {maxChars}</div>
              </div>
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Make profile private</span> 
                  <input type="checkbox" class="checkbox" bind:checked={profileData.private} disabled='{!profileData.pro}' />
                </label>
              </div>
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Show Achievements</span> 
                  <input type="checkbox" class="checkbox" bind:checked={profileData.achievements} />
                </label>
              </div>
              <div class="flex justify-center"><button class="btn btn-accent btn-outline shadow-xl btn-sm {showMessage ? (isSuccess ? "btn-success" : "btn-error") : ""}" on:click={updateProfile}>
                {#if isLoading}
                <span class="loading loading-spinner"></span>
                Loading...        
              {/if}
              {#if showMessage}
                {#if isSuccess}
                <span class="btn-success"></span>
                Success! <span class="material-symbols-outlined">done</span>
                {:else}
                <span class="btn-error"></span>
                Error! <span class="material-symbols-outlined">error</span>
                {/if}
                {:else}
                Update profile<span class="material-symbols-outlined">done</span>
              {/if}
            </button>
            
          </div>
              <div class="divider"></div>
              <div class="flex justify-center"><button class="btn btn-outline btn-error btn-neutral">Delete your account</button></div>
        </div>
    {:else}
   <Loading />
    {/if}
</main>
</AuthCheck>
