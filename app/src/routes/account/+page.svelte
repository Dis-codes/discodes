<script lang="ts">
    import { themeStore} from "$lib/stores";
    import { onMount } from 'svelte';
    import { NavBar, Loading, AuthCheck } from "$lib/components/Components";
    import { writable } from 'svelte/store';
    
    const currentPage = writable('page1');
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


  let setting:any = [{name: "Experimental features", tooltip: "Can cause bugs but implements latest features"}, 
                     {name: "Light theme",tooltip: "For people who prefer light theme"},
                    ]
  let settingc:any =[{namec:"Enable Ads",tooltipc:"Just some support (optional)"},
                     {namec:"Enable tips",tooltipc:"Tooltips for blocks!"}
                    ]
</script>

<AuthCheck>
<NavBar/>
<main class="flex items-center justify-center h-screen shadow-xl">
    {#if user}
      <div class="shadow-xl h-32 mb-96 mt-1 mr-2 w-10 border border-neutral rounded-lg">
        <div class="ml-2 mt-2">
    <button on:click={() => $currentPage = 'page1'}><span class="mb-3 mt-1 material-symbols-outlined">person</span></button>
    <button on:click={() => $currentPage = 'page3'}><span class="material-symbols-outlined">shield_person</span></button>
    <button on:click={() => $currentPage = 'page2'}><span class="material-symbols-outlined mt-2">Settings</span></button>
  </div>
</div>
    {#if $currentPage === 'page1'}
      <div>
        <div class="p-6 shadow-xl border border-neutral rounded-lg ">
          <div class="flex justify-center"><h1 class="text-2xl font-semibold">
            <a href="/user"><img src={avatar_url} 
            alt={"Profile Picture of " + (user ? full_name : "User")} 
            class="w-16 h-16 rounded-full mr-2 mt-3 border border-neutral"/>
            </a>
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
      </div>
    {:else if $currentPage === 'page2'}
      <div>
        <div class="p-6 shadow-xl border border-neutral rounded-lg mb-28">

          <div class="flex justify-start font-bold text-3xl">
          <div class="ml-2">
              <a class="tab tab-active text-3xl">Settings</a> 
              <a class="tab mt- text-2xl">Plugins</a>
              <a class="tab  text-2xl mr-52">Privacy</a>
            <div class="divider mb-8 mt-5"></div>
        </div>
        </div>
        <div class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text">Themes</span>
          </label>
          <select bind:value={$themeStore} class="select select-bordered">
            <option disabled selected>Pick one</option>
            <option value="dark">Dark (dark)</option>
            <option value="dracula">Dracula (dark)</option>
            <option value="forest">Forest (dark)</option>
            <option value="winter">Winter (light)</option>
            <option value="pastel">Pastel (light)</option>
          </select>
          </div>
        {#each settingc as c}
            <div class="form-control">
              <div class="lg:tooltip" data-tip="{c.tooltipc}">
              <label class="label cursor-pointer">
                <span class="label-text mr-2">{c.namec}</span> 
                <input type="checkbox" class="checkbox" checked />
              </label>
              </div>
            </div>
          {/each}
            {#each setting as s}
            <div class="form-control">
              <div class="lg:tooltip" data-tip="{s.tooltip}">
              <label class="label cursor-pointer">
                <span class="label-text font-semibold">{s.name}</span> 
                <input type="checkbox" class="toggle" checked/>
              </label>
              </div>
            </div>
            {/each}
            </div>
        <!-- Add your content here -->
      </div>
      {:else if $currentPage === 'page3'}
      <div class="p-6 shadow-xl rounded-lg border border-neutral mb-32">
        <div class="flex justify-center"><h1 class="text-3xl font-bold">Admin's Headquarters</h1></div>
        <div class="divider"></div>
        <h2 class="text-xl font-semibold">Welcome back {user.user_metadata.full_name}!</h2>
        <p class="text-gray-500 mb-6">You are logged in as an admin.</p>

        
        <h2 class="text-xl font-semibold">Registered users:
        <!-- {info.registeredUsers} -->
        <!-- <h2 class="text-xl font-semibold">Reports: <span>{info.reports}</span> -->
        <div class="divider"></div>
        </h2>
        <div class="flex justify-center"><h2 class="text-xl font-semibold">Admin's Tools</h2></div>
        <div class="mt-4">
            <button on:click={() => window.changelogModal.showModal()} class="btn btn-accent btn-outline shadow-xl">Send changelog</button>
            <button class="btn btn-success btn-outline shadow-xl">Send Custom Message</button>
            <button class="btn btn-error btn-outline shadow-xl">Force Update Website</button>
        </div>
    </div>
      

      {/if}

    {:else}
   <Loading />
    {/if}
</main>
</AuthCheck>
