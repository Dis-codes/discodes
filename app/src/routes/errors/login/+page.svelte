<script lang="ts">
    export let data
    let { supabase, session } = data
    $: ({ supabase, session } = data)

    const handleSignIn = async () => {
        await supabase.auth.signInWithOAuth({
            provider:'discord',
            options: {
                redirectTo:`${location.origin}/auth/callback`
            }
        })
    }
</script>
<div class='flex justify-center items-center h-screen'>
    <div class="card w-96 bg-base-100 shadow-xl ">
        <figure class="px-10 pt-10">
            <img src="../../Gifs/sad-pikachu.gif" alt="Shoes" class="rounded-xl" />
        </figure>
        <div class="card-body items-center text-center">
            <h2 class="card-title">Uh Oh!</h2>
            <p class='text-error'>You must be signed in to view this page!</p>
            <div class="card-actions">
                <a class="btn btn-secondary" href="/">Go to Landing page</a>
                <button class="btn btn-primary" on:click={handleSignIn}>Login</button>
            </div>
        </div>
    </div>
</div>