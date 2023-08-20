
export default async function GetUserOnDiscord(discordId: string) {
    const response = await fetch(`/api/v1/discord/user?id=${discordId}`)
    return await response.json()
} 
    