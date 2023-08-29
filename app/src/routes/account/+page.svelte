<script lang="ts">
    import { settings } from "$lib/stores";
    import { onMount } from 'svelte';
    import { GetUserRoles } from "discodes-utilities";
    import { NavBar, Loading, AuthCheck, RoleCheck} from "$lib/components/Components";
    import { writable } from 'svelte/store';
    const currentPage = writable('page1');
    export let data;
    let { supabase, session } = data;
    $: ({ supabase, session } = data);
    const  user = session?.user;

    let isAdmin = false
    async function getAdmin(){
      const roles = await GetUserRoles(user?.user_metadata.provider_id);
      if (roles && roles.includes('1142531927967023114')) {
        isAdmin = true;
      }
    }
    getAdmin();
    /*PAGE 1*/
    let maxChars = 100;
    let profileData = {
    bio: 'Loading...',
    private: false,
    achievements: true,
    pro: false,
    timezone: $settings?.timezone
};
    let isLoading = false;
    let showMessage = false;
    let isSuccess = false;
    let initialProfileData = { ...profileData };
    const {full_name, avatar_url} = user?.user_metadata;

    async function initOne(){
      const { data, error } = await supabase
            .from('identity')
            .select('bio, private, achievements, pro, timezone')
            .eq('id', user?.id);

        if (error) {
            return;
        }
      let setSettings = $settings 
      setSettings.timezone = data[0]?.timezone
      settings.set({ ...setSettings})
       
       profileData = data[0];
       initialProfileData = { ...profileData };
    }
    async function updateProfile() {
     profileData.timezone = $settings?.timezone;
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
  .update({ bio: profileData?.bio , private: profileData?.private, achievements: profileData?.achievements, pro: profileData?.pro, timezone: $settings?.timezone })
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
    initOne();

    /*PAGE 2*/
  let activeTab = 'settings';
  function changeTab(tabName) {
    activeTab = tabName;
  }

    /*PAGE 3*/
    let info = {
        registeredUsers: "loading...",
        onlineUsers: "loading...",
        reports: 3,
    }
    let Users = async () => {
    const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
    
        if (profilesData) {
        info.registeredUsers = profilesData.length;
        info.onlineUsers = profilesData.filter(profile => (new Date(profile.logged_at)).getTime() > (Date.now() - 1000 * 60 * 60 * 23)).length;
        info.onlineUsersHour = profilesData.filter(profile => (new Date(profile.logged_at)).getTime() > (Date.now() - 1000 * 60 * 60)).length;
        }
    }
    Users();
    async function sendNewLog() {
    const title = document.getElementById('titleInput')?.value;
    const description = document.getElementById('descriptionInput')?.value;
    const tags = document.getElementById('tagsInput')?.value.split(',').map(tag => tag.trim());
    const image = document.getElementById('imageInput')?.value;
    if (!title || !description || !tags) {
        alert('Please fill in all fields');
        return;
    }
    const { error } = await supabase
        .from('changelog')
        .insert([
            { user_id: user.id, title, description, image, tags },
        ])
    if (error) {
        console.log(error);
        return;
    }
    fetch('/api/v1/changelog/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description, tags, image })
    })
}
</script>

<AuthCheck>
<NavBar/>
<main class="flex items-center justify-center h-screen shadow-xl">
    {#if user}
    <div class="flex flex-col sm:flex-row w-full sm:w-auto">
      <div class="shadow-xl mb-2 sm:w-10 sm:mb-0 sm:mr-2 border border-neutral rounded-lg">
        <div class="ml-2 sm:my-2 flex flex-row sm:flex-col justify-between h-10 sm:h-full">
          <div class="gap-3 flex flex-row sm:flex-col items-center sm:mr-2 mt-2 sm:mt-0">
            <button on:click={() => $currentPage = 'page1'}><span class="material-symbols-outlined">person</span></button>
            <button on:click={() => $currentPage = 'page2'}><span class="material-symbols-outlined ">settings</span></button>
            <a href="/user/{user.user_metadata.full_name}/plugins"><span class="material-symbols-outlined ">extension</span></a>
{#if isAdmin}
            <button on:click={() => $currentPage = 'page3'}><span class="material-symbols-outlined">shield_person</span></button>
{/if}
          </div>
          <div class="sm:mb-4 mt-2 mr-2"><a href="/auth/logout"><span class="material-symbols-outlined ">logout</span></a></div>
        </div>
      </div>
    {#if $currentPage === 'page1'}
        <div class="p-6 shadow-xl border border-neutral rounded-lg ">
          <div class="flex justify-center"><a href="/user/{user.user_metadata.full_name}" class="text-2xl font-semibold">
            <img src={avatar_url} 
            alt={"Profile Picture of " + (user ? full_name : "User")} 
            class="w-16 h-16 rounded-full mr-2 mt-3 border border-neutral"/>
          </a>
          <div class="ml-2">
            <div class="p-4">
                <a href="/user/{user.user_metadata.full_name}" class="text-xl font-semibold">{full_name}</a>
                <p class="text-gray-500">{user?.email}</p>
            </div>
        </div>
        </div>
          <div class="divider"></div>
          <div class="form-control relative">
              <textarea class="textarea h-28 textarea-ghost mb-2 shadow-sm textarea-bordered" 
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
            <div class="form-control">
              <label class="label">
                <span class="label-text">Timezone</span>
              </label>
              <select class="select select-bordered " bind:value={$settings.timezone}>
                <option value="none">NONE - disabled</option>
                <option value="International Date Line West">(GMT-12:00) International Date Line West</option>
                  <option value="American Samoa">(GMT-11:00) American Samoa</option>
                  <option value="Midway Island">(GMT-11:00) Midway Island</option>
                  <option value="Hawaii">(GMT-10:00) Hawaii</option>
                  <option value="Alaska">(GMT-09:00) Alaska</option>
                  <option value="Pacific Time (US &amp; Canada)">(GMT-08:00) Pacific Time (US &amp; Canada)</option>
                  <option value="Tijuana">(GMT-08:00) Tijuana</option>
                  <option value="Arizona">(GMT-07:00) Arizona</option>
                  <option value="Mazatlan">(GMT-07:00) Mazatlan</option>
                  <option value="Mountain Time (US &amp; Canada)">(GMT-07:00) Mountain Time (US &amp; Canada)</option>
                  <option value="Central America">(GMT-06:00) Central America</option>
                  <option value="Central Time (US &amp; Canada)">(GMT-06:00) Central Time (US &amp; Canada)</option>
                  <option value="Chihuahua">(GMT-06:00) Chihuahua</option>
                  <option value="Guadalajara">(GMT-06:00) Guadalajara</option>
                  <option value="Mexico City">(GMT-06:00) Mexico City</option>
                  <option value="Monterrey">(GMT-06:00) Monterrey</option>
                  <option value="Saskatchewan">(GMT-06:00) Saskatchewan</option>
                  <option value="Bogota">(GMT-05:00) Bogota</option>
                  <option value="Eastern Time (US &amp; Canada)">(GMT-05:00) Eastern Time (US &amp; Canada)</option>
                  <option value="Indiana (East)">(GMT-05:00) Indiana (East)</option>
                  <option value="Lima">(GMT-05:00) Lima</option>
                  <option value="Quito">(GMT-05:00) Quito</option>
                  <option value="Atlantic Time (Canada)">(GMT-04:00) Atlantic Time (Canada)</option>
                  <option value="Caracas">(GMT-04:00) Caracas</option>
                  <option value="Georgetown">(GMT-04:00) Georgetown</option>
                  <option value="La Paz">(GMT-04:00) La Paz</option>
                  <option value="Puerto Rico">(GMT-04:00) Puerto Rico</option>
                  <option value="Santiago">(GMT-04:00) Santiago</option>
                  <option value="Newfoundland">(GMT-03:30) Newfoundland</option>
                  <option value="Brasilia">(GMT-03:00) Brasilia</option>
                  <option value="Buenos Aires">(GMT-03:00) Buenos Aires</option>
                  <option value="Greenland">(GMT-03:00) Greenland</option>
                  <option value="Montevideo">(GMT-03:00) Montevideo</option>
                  <option value="Mid-Atlantic">(GMT-02:00) Mid-Atlantic</option>
                  <option value="Azores">(GMT-01:00) Azores</option>
                  <option value="Cape Verde Is.">(GMT-01:00) Cape Verde Is.</option>
                  <option value="Edinburgh">(GMT+00:00) Edinburgh</option>
                  <option value="Lisbon">(GMT+00:00) Lisbon</option>
                  <option value="London">(GMT+00:00) London</option>
                  <option value="Monrovia">(GMT+00:00) Monrovia</option>
                  <option value="UTC">(GMT+00:00) UTC</option>
                  <option value="Amsterdam">(GMT+01:00) Amsterdam</option>
                  <option value="Belgrade">(GMT+01:00) Belgrade</option>
                  <option value="Berlin">(GMT+01:00) Berlin</option>
                  <option value="Bern">(GMT+01:00) Bern</option>
                  <option value="Bratislava">(GMT+01:00) Bratislava</option>
                  <option value="Brussels">(GMT+01:00) Brussels</option>
                  <option value="Budapest">(GMT+01:00) Budapest</option>
                  <option value="Casablanca">(GMT+01:00) Casablanca</option>
                  <option value="Copenhagen">(GMT+01:00) Copenhagen</option>
                  <option value="Dublin">(GMT+01:00) Dublin</option>
                  <option value="Ljubljana">(GMT+01:00) Ljubljana</option>
                  <option value="Madrid">(GMT+01:00) Madrid</option>
                  <option value="Paris">(GMT+01:00) Paris</option>
                  <option value="Prague">(GMT+01:00) Prague</option>
                  <option value="Rome">(GMT+01:00) Rome</option>
                  <option value="Sarajevo">(GMT+01:00) Sarajevo</option>
                  <option value="Skopje">(GMT+01:00) Skopje</option>
                  <option value="Stockholm">(GMT+01:00) Stockholm</option>
                  <option value="Vienna">(GMT+01:00) Vienna</option>
                  <option value="Warsaw">(GMT+01:00) Warsaw</option>
                  <option value="West Central Africa">(GMT+01:00) West Central Africa</option>
                  <option value="Zagreb">(GMT+01:00) Zagreb</option>
                  <option value="Zurich">(GMT+01:00) Zurich</option>
                  <option value="Athens">(GMT+02:00) Athens</option>
                  <option value="Bucharest">(GMT+02:00) Bucharest</option>
                  <option value="Cairo">(GMT+02:00) Cairo</option>
                  <option value="Harare">(GMT+02:00) Harare</option>
                  <option value="Helsinki">(GMT+02:00) Helsinki</option>
                  <option value="Jerusalem">(GMT+02:00) Jerusalem</option>
                  <option value="Kaliningrad">(GMT+02:00) Kaliningrad</option>
                  <option value="Kyiv">(GMT+02:00) Kyiv</option>
                  <option value="Pretoria">(GMT+02:00) Pretoria</option>
                  <option value="Riga">(GMT+02:00) Riga</option>
                  <option value="Sofia">(GMT+02:00) Sofia</option>
                  <option value="Tallinn">(GMT+02:00) Tallinn</option>
                  <option value="Vilnius">(GMT+02:00) Vilnius</option>
                  <option value="Baghdad">(GMT+03:00) Baghdad</option>
                  <option value="Istanbul">(GMT+03:00) Istanbul</option>
                  <option value="Kuwait">(GMT+03:00) Kuwait</option>
                  <option value="Minsk">(GMT+03:00) Minsk</option>
                  <option value="Moscow">(GMT+03:00) Moscow</option>
                  <option value="Nairobi">(GMT+03:00) Nairobi</option>
                  <option value="Riyadh">(GMT+03:00) Riyadh</option>
                  <option value="St. Petersburg">(GMT+03:00) St. Petersburg</option>
                  <option value="Volgograd">(GMT+03:00) Volgograd</option>
                  <option value="Tehran">(GMT+03:30) Tehran</option>
                  <option value="Abu Dhabi">(GMT+04:00) Abu Dhabi</option>
                  <option value="Baku">(GMT+04:00) Baku</option>
                  <option value="Muscat">(GMT+04:00) Muscat</option>
                  <option value="Samara">(GMT+04:00) Samara</option>
                  <option value="Tbilisi">(GMT+04:00) Tbilisi</option>
                  <option value="Yerevan">(GMT+04:00) Yerevan</option>
                  <option value="Kabul">(GMT+04:30) Kabul</option>
                  <option value="Ekaterinburg">(GMT+05:00) Ekaterinburg</option>
                  <option value="Islamabad">(GMT+05:00) Islamabad</option>
                  <option value="Karachi">(GMT+05:00) Karachi</option>
                  <option value="Tashkent">(GMT+05:00) Tashkent</option>
                  <option value="Chennai">(GMT+05:30) Chennai</option>
                  <option value="Kolkata">(GMT+05:30) Kolkata</option>
                  <option value="Mumbai">(GMT+05:30) Mumbai</option>
                  <option value="New Delhi">(GMT+05:30) New Delhi</option>
                  <option value="Sri Jayawardenepura">(GMT+05:30) Sri Jayawardenepura</option>
                  <option value="Kathmandu">(GMT+05:45) Kathmandu</option>
                  <option value="Almaty">(GMT+06:00) Almaty</option>
                  <option value="Astana">(GMT+06:00) Astana</option>
                  <option value="Dhaka">(GMT+06:00) Dhaka</option>
                  <option value="Urumqi">(GMT+06:00) Urumqi</option>
                  <option value="Rangoon">(GMT+06:30) Rangoon</option>
                  <option value="Bangkok">(GMT+07:00) Bangkok</option>
                  <option value="Hanoi">(GMT+07:00) Hanoi</option>
                  <option value="Jakarta">(GMT+07:00) Jakarta</option>
                  <option value="Krasnoyarsk">(GMT+07:00) Krasnoyarsk</option>
                  <option value="Novosibirsk">(GMT+07:00) Novosibirsk</option>
                  <option value="Beijing">(GMT+08:00) Beijing</option>
                  <option value="Chongqing">(GMT+08:00) Chongqing</option>
                  <option value="Hong Kong">(GMT+08:00) Hong Kong</option>
                  <option value="Irkutsk">(GMT+08:00) Irkutsk</option>
                  <option value="Kuala Lumpur">(GMT+08:00) Kuala Lumpur</option>
                  <option value="Perth">(GMT+08:00) Perth</option>
                  <option value="Singapore">(GMT+08:00) Singapore</option>
                  <option value="Taipei">(GMT+08:00) Taipei</option>
                  <option value="Ulaanbaatar">(GMT+08:00) Ulaanbaatar</option>
                  <option value="Osaka">(GMT+09:00) Osaka</option>
                  <option value="Sapporo">(GMT+09:00) Sapporo</option>
                  <option value="Seoul">(GMT+09:00) Seoul</option>
                  <option value="Tokyo">(GMT+09:00) Tokyo</option>
                  <option value="Yakutsk">(GMT+09:00) Yakutsk</option>
                  <option value="Adelaide">(GMT+09:30) Adelaide</option>
                  <option value="Darwin">(GMT+09:30) Darwin</option>
                  <option value="Brisbane">(GMT+10:00) Brisbane</option>
                  <option value="Canberra">(GMT+10:00) Canberra</option>
                  <option value="Guam">(GMT+10:00) Guam</option>
                  <option value="Hobart">(GMT+10:00) Hobart</option>
                  <option value="Melbourne">(GMT+10:00) Melbourne</option>
                  <option value="Port Moresby">(GMT+10:00) Port Moresby</option>
                  <option value="Sydney">(GMT+10:00) Sydney</option>
                  <option value="Vladivostok">(GMT+10:00) Vladivostok</option>
                  <option value="Magadan">(GMT+11:00) Magadan</option>
                  <option value="New Caledonia">(GMT+11:00) New Caledonia</option>
                  <option value="Solomon Is.">(GMT+11:00) Solomon Is.</option>
                  <option value="Srednekolymsk">(GMT+11:00) Srednekolymsk</option>
                  <option value="Auckland">(GMT+12:00) Auckland</option>
                  <option value="Fiji">(GMT+12:00) Fiji</option>
                  <option value="Kamchatka">(GMT+12:00) Kamchatka</option>
                  <option value="Marshall Is.">(GMT+12:00) Marshall Is.</option>
                  <option value="Wellington">(GMT+12:00) Wellington</option>
                  <option value="Chatham Is.">(GMT+12:45) Chatham Is.</option>
                  <option value="Nuku'alofa">(GMT+13:00) Nuku'alofa</option>
                  <option value="Samoa">(GMT+13:00) Samoa</option>
                  <option value="Tokelau Is.">(GMT+13:00) Tokelau Is.</option>
                </select>
              </div>
            <div class="flex justify-center"><button class="btn btn-accent btn-outline shadow-xl btn-sm mt-4 {showMessage ? (isSuccess ? "btn-success" : "btn-error") : ""}" on:click={updateProfile}>
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
      </div>
    {:else if $currentPage === 'page2'}
    <div class="p-6 shadow-xl border border-neutral rounded-lg ">

      <div class="flex justify-start font-bold text-3xl">
        <div class="ml-2">
          <button class="tab {activeTab == "settings"? "tab-active text-3xl" : "text-2xl"}" on:click={() => changeTab('settings')}>Settings</button> 
          <button class="tab {activeTab == "preferences"? "tab-active text-3xl" : "text-2xl"}" on:click={() => changeTab('preferences')}>Preferences</button>
          <button class="tab {activeTab == "privacy"? "tab-active text-3xl" : "text-2xl"}" on:click={() => changeTab('privacy')}>Privacy</button>
          <div class="divider mb-8 mt-5"></div>
        </div>
    </div>
    {#if activeTab === 'settings'}
    <div class="form-control">
      <div class="lg:tooltip" data-tip="Hide plugins for being automatically public - require a pro plan">
      <label class="label cursor-pointer">
        <span class="label-text font-semibold">Private plugins</span> 
        <input type="checkbox" class="toggle" disabled bind:checked={$settings.privatePlugin}/>
      </label>
      </div>
    </div>
 <div class="form-control">
          <div class="lg:tooltip" data-tip="Tooltips for workspace">
          <label class="label cursor-pointer">
            <span class="label-text font-semibold">Tips</span> 
            <input type="checkbox" class="toggle" bind:checked={$settings.tips}/>
          </label>
          </div>
        </div>
        <div class="form-control">
          <div class="lg:tooltip" data-tip="You must buy pro plan to turn off ads">
          <label class="label cursor-pointer">
            <span class="label-text font-semibold">Ads
            </span> 
            <input type="checkbox" class="toggle" bind:checked={$settings.ads} disabled/>
          </label>
        </div>
        </div>
        <!-- <div class="flex justify-center"><button on:click={$updateSettings} class="btn btn-accent btn-outline shadow-xl btn-sm">Update</button></div> -->
        {:else if activeTab === 'privacy'} 
        <div class="form-control">
          <div class="lg:tooltip" data-tip="Request for data download to be send to you">
          <label class="label cursor-pointer">
            <span class="label-text font-semibold">Download data
            </span> 
            <button class="btn" disabled>Request</button>
          </label>
        </div>
        </div>
        <div class="divider">Danger zone</div>
        <div class="flex justify-center"><a href="/goodbye" class="btn btn-outline btn-error btn-neutral">Delete your account</a></div>
        {:else if activeTab === 'preferences'} 
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Themes</span>
          </label>
          <select bind:value={$settings.theme} class="select select-bordered">
            <option value="dark">Dark (Default)</option>
            <option value="dracula">Dracula</option>
            <option value="black">Amoled</option>
            <option value="luxury">Luxury</option>
            <option value="night">Night</option>
            <option value="business">Business</option>
            <option value="retro">Retro</option>
            <option value="pastel">Pastel</option>
            <option value="winter">Winter</option>
    </select>
          </div>
        <div class="divider">Advanced</div>
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Sorting method</span>
          </label>
          <select class="select select-bordered" bind:value={$settings.sortingMethod}>
            <option value="default">default</option>
          </select>
          </div>
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">Content Filtering and Blocking</span>
            </label>
            <textarea class="textarea h-28 textarea-ghost mb-2 shadow-sm textarea-bordered"
            placeholder="Add keywords to block, separate by comma"
            style="resize: none;"
            maxlength="100"
            bind:value={$settings.contentFiltering}
            ></textarea>
            </div>
            <!-- <div class="flex justify-center"><button on:click={updateSettings} class="btn btn-accent btn-outline shadow-xl btn-sm">Update</button></div> -->
        {/if}
      </div>
    {:else if $currentPage === 'page3'} 
    <div class="p-6 mt-0 shadow-xl rounded-lg border border-neutral sm:max-h-[30rem]">
      <div class="flex justify-center"><h1 class="text-3xl font-bold">Admin's Headquarters</h1></div>
      <RoleCheck roleID={'1142531927967023114'} userID={user?.user_metadata.provider_id}>
      <div class="divider"></div>
          <h2 class="text-xl font-semibold">Welcome back {user.user_metadata.full_name}!</h2>
          <p class="text-gray-500 mb-6">You are logged in as an admin.</p>

          
          <h2 class="text-xl font-semibold">Registered users:
          {info.registeredUsers}
          </h2>
          <h2 class="text-xl font-semibold">Last day online users:
            {info.onlineUsers}
            </h2>
          <h2 class="text-xl font-semibold">Online users:
            {info.onlineUsersHour}
            </h2>
          <h2 class="text-xl font-semibold">Reports: <span>{info.reports}</span>
          {#if info.reports > 0 }
          <button class="btn btn-sm btn-info  btn-outline shadow-xl">View reports</button>
          {/if}
          <div class="divider"></div>
          </h2>
          <div class="flex justify-center"><h2 class="text-xl font-semibold">Admin's Tools</h2></div>
          <div class="mt-4 flex flex-col sm:flex-row gap-2">
              <button on:click={() => window.changelogModal.showModal()} class="btn btn-accent btn-outline shadow-xl">Send changelog</button>
              <button class="btn btn-success btn-outline shadow-xl">Send Custom Message</button>
              <button class="btn btn-error btn-outline shadow-xl">Force Update Website</button>
          </div>
        </RoleCheck>
      </div>
      <dialog id="changelogModal" class="modal">
        <form method="dialog" class="modal-box">
            <h3 class="font-bold text-xl">Sending a changelog</h3>
            <input id="titleInput" type="text" placeholder="Title" class="input input-bordered w-full max-w-xs" />
            <input id="descriptionInput" type="text" placeholder="Description" class="input input-bordered w-full max-w-xs" />
            <input id="tagsInput" type="text" placeholder="Tags, separate by comma" class="input input-bordered w-full max-w-xs" />
            <input id="imageInput" type="text" placeholder="Image URL" class="input input-bordered w-full max-w-xs" />
            <div class="modal-action">
                <button class="btn btn-error btn-outline" on:click={sendNewLog} type="button">Send</button>
                <button class="btn">Close</button>
            </div>
        </form>
    </dialog>
      {/if}
    </div>
    {:else}
   <Loading />
    {/if}
</main>
</AuthCheck>

