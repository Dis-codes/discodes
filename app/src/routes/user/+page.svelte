<script lang="ts">
  import { onMount } from "svelte";
  import { user } from "$lib/stores";

    onMount(() => {
        let username = $user.user_metadata.full_name
        if (!username) {
          window.location.href = "/errors/login";
        }
        window.location.href = "/user/" + username;
    });
</script>