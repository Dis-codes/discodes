<script>
  import { user } from "$lib/userStore";
  import NavBar from '$lib/components/NavBar.svelte';

  let dummyNotifications = [
    { id: 1, message: "You have a new message.", timestamp: "2023-08-11 12:30 PM" },
    { id: 2, message: "Your order has been shipped.", timestamp: "2023-08-10 09:15 AM" },
  ];
</script>

<NavBar/>

<main class="flex items-center justify-center h-screen">
  {#if $user}
    <div class="p-6 shadow rounded-lg border">
      <div class="flex justify-center"><h1 class="text-2xl font-semibold">User notifications</h1></div>
      <div class="divider my-4"></div>

      {#each /*$user.data.notifications*/ dummyNotifications as notification (notification.id)}
        <div class="py-2 border-b">
          <p class="text-sm text-gray-500">{notification.timestamp}</p>
          <p class="text-lg">{notification.message}</p>
        </div>
      {/each}

    </div>
  {:else}
    <span class="loading loading-spinner text-discodes loading-lg"></span>
  {/if}
</main>
