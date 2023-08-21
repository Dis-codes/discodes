<script>
  import { user } from "$lib/userStore";
  import { NavBar, Loading } from "$lib/components/Components";
  let dummyNotifications = [
    { id: 1, message: "You have a new message.", timestamp: "2023-08-11 12:30 PM" },
    { id: 2, message: "Your order has been shipped.", timestamp: "2023-08-10 09:15 AM" },
  ];

</script>

<NavBar/>

<main class="flex items-center justify-center h-screen">
  {#if $user}
    <div class="p-8 shadow-xl rounded-lg border border-neutral">
      <div class="flex justify-center"><h1 class="text-3xl font-bold">Notifications</h1></div>
      <div class="divider divide-neutral my-6"></div>

      {#each /*$user.data.notifications*/ dummyNotifications as notification (notification.id)}
        <div class="py-2">
          <div class="collapse border border-neutral shadow-xl">
            <input type="checkbox"/> 
            <div class="collapse-title text-xl font-medium ">
              <p class="text-sm text-gray-500">{notification.message}<br>{notification.timestamp}</p>
            </div>
            <div class="collapse-content"> 
            <p class="text-lg ">Your robux subscription expired ;0</p>
            </div>
          </div>
        </div>
      {/each}

    </div>
  {:else}
    <Loading />
  {/if}
</main>
