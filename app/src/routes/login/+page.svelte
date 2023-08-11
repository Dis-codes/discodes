<script lang="ts">
    import { user, auth } from "$lib/firebase";
    import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        const user = await signInWithPopup(auth, provider);
    }
</script>

{#if $user}
    <h2>Hi {$user.displayName}</h2>
    <p class="text-center text-success">You are logged in!</p>
    <img src='../../../Gifs/congrats.gif' alt='Congratulations!'>
    <div>
        <button class="btn btn-warning mr-3" on:click={() => signOut(auth)}>Sign out</button>
        <a href="/login/username" class="btn btn-accent">Next</a>
    </div>
{:else}
    <p class="font-bold text-xl">Sign in<p>
    <button class="btn btn-primary" on:click={signInWithGoogle}>Sign in with Google</button>
{/if}

