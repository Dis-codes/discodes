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
    const { session, supabase,  } = await request.json();
    if (!url.origin.includes("discodes.xyz")) throw error(500, 'Origin is NOT discodes.xyz')
    if (!session || !supabase || session.user.role !== "authenticated") throw error(500, "User is NOT authenticated")


    const { data: data1, error: error1 } = await supabaseAUTH.auth.admin.deleteUser(
    session.user.id
  )
  if (error1) throw error(500, error.message)
  const { data: fetchedData, error: error2 } = await supabaseAUTH
  .from('identity')
  .select('id, followers')

  const updatedRows = fetchedData.map(row => {
    if (row?.followers?.includes(session.user.id)) {
      const followers = row.followers.filter(follower => follower !== session.user.id);
      if (followers.length !== row.followers.length) {
        return { ...row, followers };
      }
    }
    return row;
  });
  const rowsToUpdate = updatedRows.filter(row => row.followers !== fetchedData.find(originalRow => originalRow.id === row.id).followers);

  console.log(rowsToUpdate)
  if (rowsToUpdate.length > 0) {
    const { data: updateData, error: updateError } = await supabaseAUTH
      .from('identity')
      .upsert(rowsToUpdate);
  
    if (updateError) return new Response(JSON.stringify({ data: "Account deleted" }), { status: 500 });

  }
  return new Response(JSON.stringify({ data: updatedRows }), { status: 200 });
};
