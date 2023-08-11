<script lang="ts">
    import AuthCheck from "$lib/components/AuthCheck.svelte";
    import BotUptime from "$lib/components/DashboardComponents/BotUptime.svelte";
    import CommandStats from "$lib/components/DashboardComponents/CommandStats.svelte";
    import NavBar from "$lib/components/NavBar.svelte";
</script>

<AuthCheck>
<NavBar/>
<BotUptime/>
<CommandStats/>
</AuthCheck>