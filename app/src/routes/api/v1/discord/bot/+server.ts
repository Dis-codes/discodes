import { error } from "@sveltejs/kit";

export const POST = async ({ request, url }: { request: Request; url: URL }): Promise<Response> => {
    const {token} = await request.json()
    let userRoles: string[];
    const response = await fetch(`https://discord.com/api/oauth2/applications/@me`, {
        headers: {
            'Authorization': `Bot ${token}`
        }
    });

    if (!response.ok) throw error(500,'Response is NOT ok')
    const data = await response.json();
    
    return new Response(JSON.stringify({ data: data }), { status: 200 });
};
