<script lang="ts">
    import { user, auth } from "$lib/firebase";
    import { goto } from "$app/navigation";

    import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        const user = await signInWithPopup(auth, provider);
    }

</script>

<h2>Login</h2>

{#if $user}
    <h2>Hi {$user.displayName}</h2>
    <p class="text-center text-success">You are logged in!</p>
    <img src='../../../Gifs/congrats.gif' alt='Congratulations!'>
    <div>
        <button class="btn btn-warning mr-3" on:click={() => signOut(auth)}>Sign out</button>
        <button class="btn btn-accent" on:click={() => goto('/login/username')}>Next</button>
    </div>
{:else}
    <p>Sign in<p>
    <button class="btn btn-primary" on:click={signInWithGoogle}>Sign in with Google</button>
{/if}

