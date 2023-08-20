<script lang="ts">
  import { onMount } from "svelte";
  import { user } from "$lib/userStore";

    onMount(() => {
        let username = $user.user_metadata.full_name
        if (!username) {
          window.location.href = "/login";
        }
        window.location.href = "/user/" + username;
    });
</script>