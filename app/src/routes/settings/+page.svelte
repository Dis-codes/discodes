<script lang="ts">
  import { user } from "$lib/userStore";
  import { NavBar, Loading, AuthCheck } from "$lib/components/Components";
  
  let setting:any = [{name: "Experimental features", tooltip: "Can cause bugs but implements latest features"}, 
                     {name: "Light theme",tooltip: "For people who prefer light theme"},
                    ]
  let settingc:any =[{namec:"Enable Ads",tooltipc:"Just some support (optional)"},
                     {namec:"Enable tips",tooltipc:"Tooltips for blocks!"}
                    ]
</script>

<AuthCheck>
<NavBar/>
<main class="flex w-screen items-center justify-center h-screen">
  {#if $user}
      <div class="p-6 shadow-xl border border-neutral rounded-lg ">

          <div class="flex justify-start font-bold text-3xl">
          <div class="ml-2">
              <a class="tab tab-active text-3xl">Settings</a> 
              <a class="tab mt- text-2xl">Plugins</a>
              <a class="tab  text-2xl mr-52">Privacy</a>
            <div class="divider mb-8 mt-5"></div>
        </div>
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

  {:else}
 <Loading />
  {/if}
</main>
</AuthCheck>
