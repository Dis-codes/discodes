<script lang='ts'>
    import { goto } from "$app/navigation";
    import AuthCheck from "$lib/components/AuthCheck.svelte";
    import {db, user} from '$lib/firebase';
    import {doc, getDoc, writeBatch} from "firebase/firestore";

    let username = "";
    let loading = false;
    let isAvailable = false;

    let debounceTimer: NodeJS.Timeout;

    async function checkAvailability() {

        isAvailable = false;
        clearTimeout(debounceTimer);

        loading = true;

        debounceTimer = setTimeout(async () => {
            const ref = doc(db,"usernames", username);
            const exists = await getDoc(ref).then((doc) => doc.exists());
            
            isAvailable = !exists;
            loading = false;
        }, 500)

    }

    async function confirmUsername() {
        const batch = writeBatch(db);
        batch.set(doc(db, "usernames", username), { uid: $user?.uid });
        batch.set(doc(db, "users", $user!.uid), { 
            username, 
            photoURL: $user?.photoURL ?? null,
            published: true,
            bio: 'I am the Walrus',
            links: [
                {
                    title: 'Test Link',
                    url: 'https://kung.foo',
                icon: 'custom'
                }
            ]
    });

    await batch.commit();

    username = '';
    isAvailable = false;

}

const re = /^(?=[a-zA-Z0-9._]{3,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

$: isValid = username?.length > 2 && username.length < 16 && re.test(username);
$: isTouched = username.length > 0;
$: isTaken = isValid && !isAvailable && !loading


</script>



<AuthCheck>
    <h2 class="text-xl">Choose a username</h2>
    <form class="w-2/5" on:submit|preventDefault={confirmUsername}>
        <input
        type="text"
        placeholder="Username"
        class="input w-full"
        bind:value={username}
        on:input={checkAvailability}
        class:input-error={(!isValid && isTouched)}
        class:input-warning={isTaken}
        class:input-success={isAvailable && isValid && !loading}
        />
        <div class="my-4 min-h-16 w-full">
        {#if loading}
            {#if username.length > 0}
            <p class="text-secondary">Checking availability of @{username}...</p>
            {/if}
        {/if}
    
        {#if !isValid && isTouched}
            <p class="text-error text-sm">
                must be 3-16 characters long, alphanumeric only
            </p>
        {/if}
    
        {#if isValid && !isAvailable && !loading}
            <p class="text-warning text-sm">
                @{username} is not available
            </p>
        {/if}
    
        {#if isAvailable && isValid && !loading}
            <a class="btn btn-success" href='/login/photo'>Confirm username @{username} </a>
        {:else}
            <button class="btn btn-outline btn-disabled">Confirm username @{username} </button>
        {/if}
        </div>
    </form>
    
    
    </AuthCheck>