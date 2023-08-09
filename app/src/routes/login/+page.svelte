<script lang="ts">
    import { auth } from "$lib/firebase";

    import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        const user = await signInWithPopup(auth, provider);
        console.log(user)
    }

    import { userStore } from 'sveltefire';

    const user = userStore(auth);
</script>

<h2>Login</h2>

{#if $user}
    <h2>Hi {$user.displayName}</h2>
    <p class="text-center text-success">You are logged in!</p>
    <img src='../../../Gifs/congrats.gif' alt='Congratulations!'>
    <button class="btn btn-warning" on:click={() => signOut(auth)}>Sign out</button>
{:else}
    <p>Sign in<p>
    <button class="btn btn-primary" on:click={signInWithGoogle}>Sign in with Google</button>
{/if}

