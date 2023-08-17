// import { DISCORD_TOKEN, GUILD_ID } from '$env/static/private';
// import { user, admin } from "$lib/userStore";

//         const discordId = $user.user_metadata.provider_id;
//         console.log ('Discord ID:', discordId);
//         fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/members/${discordId}`, {
//             headers: {
//                 'Authorization': `Bot ${DISCORD_TOKEN}`
//             }
//         }).then(async response => {
//             if (response.ok) {
//                 const userData = await response.json();
//                 const roles = userData.roles;
//                 const adminRole = '1138771459938988052';
                
//                 if (roles.includes(adminRole)) {
//                     admin.update(u => {
//                         console.log('User is admin');
//                         u.admin = true;
//                         return u;
//                     });
//                 }
//             } else {
//                 console.error('Failed to fetch user data from Discord:', response.status, response.statusText);
//             }
//         }).catch(error => {
//             console.error('Error:', error);
//         });
    