import { error } from "@sveltejs/kit";

export const GET = async ({ request, url }: { request: Request; url: URL }): Promise<Response> => {
    const token = url.searchParams.get("token");
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
