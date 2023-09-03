<script lang='ts'>
    import LogOutModal from "./LogOutModal.svelte";
    import { user } from '$lib/stores';

    import { GetUserRoles } from "discodes-utilities";
    import { onMount } from "svelte";
    let notificationCount = 2;
    let isDashboard = true;

onMount(() => {
  isDashboard = window.innerWidth > 470
  window.addEventListener("resize", () => {
    isDashboard = window.innerWidth > 470
  });
});
</script>

<details class="dropdown dropdown-end dropdown-bottom w">
    <summary class="m-1 btn btn-square btn-circle">
        <img src={$user?.user_metadata?.avatar_url} alt={"Profile Picture of " + ($user ? $user.user_metadata.full_name : "User")} class="h-full w-full rounded-full notfound" />
    </summary>
    <ul class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-screen min-[450px]:w-52">
        <li><a href="/account"><span class="material-symbols-outlined">
            person
            </span> Account</a></li>
        <li><a href="/account/notifications"><span class="material-symbols-outlined">
            notifications
            </span> Notifications <span class="badge badge-error text-xs">{notificationCount}</span></a></li>
        <li><a href="/user/{$user.user_metadata?.full_name}"><span class="material-symbols-outlined">
            account_circle
            </span> Profile</a></li>
        <li><a href="/help"><span class="material-symbols-outlined">
            help
            </span> Help & Support</a></li>
            {#if !isDashboard}
            <li><a href="/dashboard"><span class="material-symbols-outlined">bar_chart_4_bars</span> Dashboard</a></li>
            {/if}
        <li class="dropdown-divider"></li>
        <LogOutModal />
    </ul>
</details>
<!-- target="_self" -->
