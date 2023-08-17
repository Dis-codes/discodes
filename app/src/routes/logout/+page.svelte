<script lang="ts">
    import { onMount } from 'svelte';
    export let data
    const { session,supabase } = data
  
    onMount(async () => {
      if (!session) window.location.href = '/';
      const { error } = await supabase.auth.signOut();
      if (!error) {
       window.location.href = '/';
       return
      }
      window.location.href = `/errors/logout`;
    });
  </script>
  
  <div class="flex flex-col items-center justify-center h-screen">
    <span class="loading loading-spinner text-discodes loading-lg"></span>
  </div>
  