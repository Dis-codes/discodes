<script lang="ts">
    export let botObject:object;
</script>

<a href="/dashboard/{botObject.id}" class="flex flex-col">
    <div class="avatar">
        <div class="w-24 h-24 rounded-full ring ring-accent mx-auto">
            <img src="https://cdn.discordapp.com/avatars/{botObject.bot.id}/{botObject.bot.avatar}" alt="bot pfp"/>
        </div>
    </div>
    <p class="text-xl text-center text mt-2">{botObject.bot.username}</p>
 </a>