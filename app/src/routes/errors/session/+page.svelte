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
    <div class="card w-[25rem] bg-base-100 shadow-xl ">
        <figure class="px-10 pt-10">
            <img src="../../Gifs/itsfine.gif" alt="gif" class="rounded-xl" />
        </figure>
        <div class="card-body items-center text-center">
            <h2 class="card-title">Oh no, you aren´t logged in!</h2>
            <p class='text-secondary'>If you want to access the workspace please login</p>
            <div class="card-actions">
                <a class="btn btn-secondary" href="/">Go back to the landing page</a>
                <button class="btn btn-primary" on:click={handleSignIn}>Login</button>
            </div>
        </div>
    </div>
</div>