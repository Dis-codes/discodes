<script lang="ts">
    import { NavBar,AuthCheck } from "$lib/components/Components";
    import BotUptime from "$lib/components/DashboardComponents/BotUptime.svelte";
    import CommandStats from "$lib/components/DashboardComponents/CommandStats.svelte";
</script>

<AuthCheck>
<NavBar/>
<BotUptime/>
<CommandStats/>
</AuthCheck>