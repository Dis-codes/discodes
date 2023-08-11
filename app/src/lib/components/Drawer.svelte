<script>
    import LogOutModal from "./LogOutModal.svelte";

</script>

<div class="drawer">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
    <!-- Page content here -->
    <label for="my-drawer" class="btn drawer-button">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 h-5 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
    </label>
    </div> 
    <div class="drawer-side">
    <label for="my-drawer" class="drawer-overlay"></label>
    <ul class="menu p-4 w-80 h-full bg-base-200 text-base-content">
        <!-- Sidebar content here -->
        <li><a href="/">Sidebar Item 1</a></li>
        <li><a href="/">Sidebar Item 2</a></li>
        <div class="divider"></div>
        <LogOutModal/>
        
    </ul>
    </div>
</div>