<script>
  import { user } from "$lib/stores";
  import { NavBar, Loading } from "$lib/components/Components";
  import { deleteNotification } from "$lib/components/supabase";
  export let data;
  let { supabase, session } = data;
  $: ({ supabase, session } = data);
  async function getNotifications(){
    const { data: notifications } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", $user.id);
    return notifications;
  }
</script>

<NavBar/>

<main class="flex items-center justify-center h-screen">
  {#if $user}
  {#await getNotifications() then notifications}
    

    <div class="p-8 shadow-xl rounded-lg border border-neutral w-full sm:w-96">
      <div class="flex justify-center"><h1 class="text-3xl font-bold">Notifications</h1></div>
      <div class="divider divide-neutral my-6"></div>
      {#if notifications.length == 0}
        <div class="flex justify-center"><p class="text-xl">No notifications</p></div>
      {/if}
      {#each  notifications as notification (notification.id)}
        <div class="py-2">
          <div class="collapse border border-neutral shadow-xl">
            <input type="checkbox"/> 
            <div class="collapse-title text-xl font-medium ">
              <p class="text-sm text-gray-500">{notification.title}<br>{new Date(notification.timestamp).toLocaleDateString()}</p>
            </div>
            <div class="collapse-content"> 
            <p class="text-lg ">{notification.message}</p>
            <div class="flex justify-end">
              <button class="btn btn-sm btn-neutral" on:click={() => deleteNotification(supabase, notification.id)}>Delete</button>
            </div>
            </div>
          </div>
        </div>
      {/each}

    </div>
    {/await}
  {:else}
    <Loading />
  {/if}
</main>
