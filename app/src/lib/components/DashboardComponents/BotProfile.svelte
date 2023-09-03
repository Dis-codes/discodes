<script lang="ts">
    import { page } from "$app/stores"

    interface BotObject {
        bot: {username: string},
        id: string
    }

    console.log( $page.url.pathname)

    export let botObject:BotObject;
</script>

{#if $page.url.pathname != `/dashboard/${botObject.id}`}
<a href="/dashboard/{botObject.id}" class="flex flex-col w-52 bg-base-100 shadow-xl border border-neutral rounded-xl">
    <figure class="px-2 pt-10 flex  justify-center h-full">
        <img src="https://cdn.discordapp.com/avatars/{botObject.bot.id}/{botObject.bot.avatar}" alt="Shoes" class="rounded-xl notfound" />
    </figure>
    <div class="flex flex-col p-8 items-center text-center">
        <h2 class="text-xl">{botObject.bot.username}</h2>
    </div>
</a>
{:else}
<a href="/dashboard/{botObject.id}" class="flex flex-col">
    <div class="avatar">
        <div class="w-24 h-24 rounded-full ring ring-accent mx-auto">
            <img src="https://cdn.discordapp.com/avatars/{botObject.bot.id}/{botObject.bot.avatar}" alt="bot pfp" class="notfound" />
        </div>
    </div>
    <p class="text-xl text-center text mt-2">{botObject.bot.username}</p>
</a>
{/if}
