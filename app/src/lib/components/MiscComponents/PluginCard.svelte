<script>
    export let plugin;
</script>
<div class="transform  scale-100  hover:scale-105  transition-transform  duration-500">
<div class="shadow-xl rounded-lg p-5 m-2 w-80 ring ring-neutral">
    <div class="font-bold text-xl mb-2 text-gray-300">{plugin.name}</div>
    <p class="text-gray-400 mb-2">{plugin.description}</p>
    <a href="/user/{plugin.user}" class="text-gray-500 hover:link hover:font-bold">By @{plugin.user}</a>
    <div class="flex justify-between items-center">
        <span class="text-gray-500">Downloads: {plugin.downloads ? plugin.downloads : 0}</span>
        <span class="text-gray-500">Likes: {plugin.rating ? plugin.rating : 0}</span>
        <span class="text-gray-500">Rating: {plugin.rating && plugin.downloads ? (Math.round(plugin.rating/plugin.downloads * 100) / 10) : 0.1}</span>
    </div>
    <div class="mt-4 flex justify-end">
        <a href="/user/{plugin.user}/plugins/{plugin.id}" class="btn btn-accent w-full">
            Open
        </a>
    </div>
</div>
</div>
