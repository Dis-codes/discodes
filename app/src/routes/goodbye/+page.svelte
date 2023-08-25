<script lang="ts">
    export let data
    let { supabase, session } = data
    async function deleteAccount(){ 
      const response = await fetch('/api/v1/user/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ session: session, supabase: supabase })
  })
  if (response.ok) {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      window.location.href = '/';
      return
    }
    window.location.href = '/errors/logout';
  }
}
</script>
<div class="flex justify-center items-center h-screen">
    <div class="card w-[26rem] bg-base-100 shadow-xl">
      <figure class="px-10 pt-10">
        <img src="../../Gifs/partner.gif" alt="Shoes" class="rounded-xl" />
      </figure>
      <div class="card-body items-center text-center">
        <h2 class="card-title">Sad to see you go!</h2>
          <p class="text-error">It means a lot for us, thank you for using our services, we hope you will come back!</p>
        <div class="card-actions">
          <a class="btn btn-secondary" href="/">Go to Landing page</a>
          <button on:click={deleteAccount} class="btn btn-primary">Delete Account</button>
        </div>
      </div>
    </div>
</div>
  