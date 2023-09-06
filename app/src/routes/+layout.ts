import { PUBLIC_SUPA_ANON_KEY, PUBLIC_SUPA_URL} from "$env/static/public";
import { createSupabaseLoadClient } from "@supabase/auth-helpers-sveltekit";
import { user, supabaseClient } from "$lib/stores";

export const load = async ({ fetch, data, depends }) => {
	depends("supabase:auth");
	const isDevelopment = import.meta.env.DEV;
	const supabase = createSupabaseLoadClient({
		supabaseUrl: PUBLIC_SUPA_URL,
		supabaseKey: PUBLIC_SUPA_ANON_KEY,
		event: { fetch },
		serverSession: data.session,
		cookieOptions: {
			domain: isDevelopment ? "localhost" : "discodes.xyz",
			maxAge: 60 * 60 * 24,
			path: "/",
			sameSite: "lax",
			secure: !isDevelopment,
		},
	});

	const { data: { session },
	} = await supabase.auth.getSession();
    
	if (session) {
		user.set(session.user); // Set the user data in the user store
		supabaseClient.set(supabase);
	} else {
		user.set({}); // Set to null if no session
		supabaseClient.set({});
	}

	return { supabase, session };
};
