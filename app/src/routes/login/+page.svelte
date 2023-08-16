<script lang="ts">
    import { Auth } from '@supabase/auth-ui-svelte'
	import { ThemeSupa } from '@supabase/auth-ui-shared'

    export let data
</script>
<div class="flex flex-col items-center justify-center h-screen">
<Auth
supabaseClient={data.supabase}
appearance={{ theme: ThemeSupa, style: { input: 'color: #fff' } }}
providers={['discord']}
redirectTo={`${data.url}/auth/callback`}
showLinks={false}
/>
</div>