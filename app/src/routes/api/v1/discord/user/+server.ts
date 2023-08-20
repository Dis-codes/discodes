import { DISCORD_TOKEN } from "$env/static/private";

const GUILD_ID = "1029802748293689384";
const badges = ['1138771459938988052', '1139658510343344291', '1139721194225016862'];

export const GET = async ({ request, url }: { request: Request; url: URL }): Promise<Response> => {
    const discordId = url.searchParams.get("id");
    let matchingRoles: string[] = [];

    const response = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/members/${discordId}`, {
        headers: {
            'Authorization': `Bot ${DISCORD_TOKEN}`
        }
    });

    if (response.ok) {
        const data = await response.json();
        const userRoles: string[] = data.roles;
        matchingRoles = userRoles.filter(role => badges.includes(role));
        console.log(matchingRoles);
    }

    return new Response(JSON.stringify({ roles: matchingRoles }), { status: 200 });
};
