import { error } from "@sveltejs/kit";
import { SUPABASE_SERVICE_ROLE } from "$env/static/private";
import { PUBLIC_SUPA_URL } from '$env/static/public'
import { createClient } from '@supabase/supabase-js';

const supabaseAUTH = createClient(PUBLIC_SUPA_URL, SUPABASE_SERVICE_ROLE, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

export const POST = async ({ request, url}: { request: Request; url: URL }): Promise<Response> => {
    const { session, supabase } = await request.json();
    if (!url.origin.includes("discodes.xyz")) throw error(500, 'Origin is NOT discodes.xyz')
    if (!session || !supabase || session.user.role !== "authenticated") throw error(500, "User is NOT authenticated")


    const { data, error } = await supabaseAUTH.auth.admin.deleteUser(
    session.user.id
  )
  console.log(data, error)
    return new Response(JSON.stringify({ data: data }), { status: 200 });
};
