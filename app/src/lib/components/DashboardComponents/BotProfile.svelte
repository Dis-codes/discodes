<script lang="ts">
    export let botObject:object;

</script>


<div class="avatar">
    <div class="w-24 rounded-full ring ring-accent mx-auto">
        <img src="https://cdn.discordapp.com/avatars/853236770040971285/{botObject.bot.avatar}" alt="bot pfp"/>
    </div>
</div>
<p class="text-xl text-center text mt-2">{botObject.bot.username}</p>