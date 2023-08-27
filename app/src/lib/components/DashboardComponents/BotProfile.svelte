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
<div class="card w-52 bg-base-100 shadow-xl border border-neutral">
    <figure class="px-2 pt-10">
        <img src="https://cdn.discordapp.com/avatars/{botObject.bot.id}/{botObject.bot.avatar}" alt="Shoes" class="rounded-xl" />
    </figure>
    <div class="card-body items-center text-center">
        <h2 class="card-title">{botObject.bot.username}</h2>
        <div class="card-actions">
            <a href="/dashboard/{botObject.id}" class="btn btn-info shadow-xl">Edit Bot</a>
        </div>
    </div>
</div>
{:else}
<a href="/dashboard/{botObject.id}" class="flex flex-col">
    <div class="avatar">
        <div class="w-24 h-24 rounded-full ring ring-accent mx-auto">
            <img src="https://cdn.discordapp.com/avatars/{botObject.bot.id}/{botObject.bot.avatar}" alt="bot pfp"/>
        </div>
    </div>
    <p class="text-xl text-center text mt-2">{botObject.bot.username}</p>
</a>
{/if}
