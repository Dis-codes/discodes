<script lang='ts'>
    import LogOutModal from "./LogOutModal.svelte";
    import { user } from '$lib/stores';
    import { supabase } from '$lib/supabase';
    import { GetUserRoles } from "discodes-utilities";
    import { onMount } from "svelte";
    let notificationCount = 0;
    onMount(async () => {
        const { data: notifications, error } = await supabase
            .from("notifications")
            .select("*")
            .eq("user_id", $user.id);
        if (error) {
            console.error("Error fetching notifications:", error);
        }
        else {
            notificationCount = notifications.length;
        }
    });
</script>

<details class="dropdown dropdown-end dropdown-bottom w">
    <summary class="m-1 btn btn-square btn-circle indicator">
       {#if notificationCount > 0 }
       <span class="indicator-item badge badge-secondary mt-2 mr-2 h-fit w-2 text-xs">{notificationCount}</span> 
       {/if} 
        <img src={$user?.user_metadata?.avatar_url} alt={"Profile Picture of " + ($user ? $user.user_metadata.full_name : "User")} class="h-full w-full rounded-full notfound" />
    </summary>
    <ul class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-screen min-[450px]:w-52">
        <li><a href="/account"><span class="material-symbols-outlined">
            person
            </span> Account</a></li>
        <li><a href="/account/notifications"><span class="material-symbols-outlined">
            notifications
            </span> Notifications {#if notificationCount > 0 }<span class="badge badge-secondary text-xs">{notificationCount}</span>{/if} </a></li>
        <li><a href="/user/{$user.user_metadata?.full_name}"><span class="material-symbols-outlined">
            account_circle
            </span> Profile</a></li>
        <li><a href="/help"><span class="material-symbols-outlined">
            help
            </span> Help & Support</a></li>
            <li><a href="/dashboard"><span class="material-symbols-outlined">bar_chart_4_bars</span> Dashboard</a></li>
        <li class="dropdown-divider"></li>
        <LogOutModal />
    </ul>
</details>
<!-- target="_self" -->
