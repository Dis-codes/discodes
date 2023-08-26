import { PUBLIC_SUPA_URL, PUBLIC_SUPA_ANON_KEY } from '$env/static/public'
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit'
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
    const isDevelopment = import.meta.env.DEV;
event.locals.supabase = createSupabaseServerClient({
    supabaseUrl: PUBLIC_SUPA_URL,
    supabaseKey: PUBLIC_SUPA_ANON_KEY,
    event,
    cookieOptions: {
        domain: isDevelopment ? 'localhost' : 'discodes.xyz',
        maxAge: 60 * 60 * 24,
        path: '/',
        sameSite: 'lax',
        secure: !isDevelopment,
    },
})

/**
 * a little helper that is written for convenience so that instead
 * of calling `const { data: { session } } = await supabase.auth.getSession()`
 * you just call this `await getSession()`
 */
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