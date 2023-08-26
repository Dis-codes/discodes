import { PUBLIC_SUPA_URL, PUBLIC_SUPA_ANON_KEY } from '$env/static/public'
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit'
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
event.locals.supabase = createSupabaseServerClient({
    supabaseUrl: PUBLIC_SUPA_URL,
    supabaseKey: PUBLIC_SUPA_ANON_KEY,
    event,
    cookieOptions: {
        domain: "discodes.xyz",
        maxAge: 100000000,
        path: "/",
        sameSite: "lax",
        secure: true,
      },
})

/**
 * a little helper that is written for convenience so that instead
 * of calling `const { data: { session } } = await supabase.auth.getSession()`
 * you just call this `await getSession()`
 */
console.log('event.locals.getSession');
event.locals.getSession = async () => {
    const {
    data: { session },
    } = await event.locals.supabase.auth.getSession()
    return session
}

return resolve(event, {
    filterSerializedResponseHeaders(name) {
    return name === 'content-range'
    },
})
}