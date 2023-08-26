import { invalidate } from '$app/navigation';
import { PUBLIC_SUPA_ANON_KEY, PUBLIC_SUPA_URL } from '$env/static/public';
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';
import { user} from '$lib/stores';

export const load = async ({ fetch, data, depends }) => {
    depends('supabase:auth');
    const supabase = createSupabaseLoadClient({
        supabaseUrl: PUBLIC_SUPA_URL,
        supabaseKey: PUBLIC_SUPA_ANON_KEY,
        event: { fetch },
        serverSession: data.session,
        cookieOptions: {
            domain: "discodes.xyz",
            maxAge: 100000000,
            path: "/",
            sameSite: "lax",
            secure: true,
          },
    });

    const { data: { session },
    } = await supabase.auth.getSession();
    
    if (session) {
        user.set(session.user); // Set the user data in the user store
    } else {
        user.set(null); // Set to null if no session
    }

    return { supabase, session };
};
