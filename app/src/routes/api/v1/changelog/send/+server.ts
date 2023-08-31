import { webhookURL } from "$env/static/private";


export const POST = async ( { request }: { request: Request; url: URL } ): Promise<Response> => {
	const { title,description,tags,image } = await request.json();
	// if (!url.origin.includes("discodes.xyz")) throw error(500, 'Origin is NOT discodes.xyz')

	const embed = {
		title: `Changelog - ${title}`,
		description: description,
		color: 0x3498db, // Embed color (Hex color code)
		timestamp: new Date().toISOString(),
		footer: {
			text: "Tags: " + tags.join(" | "),
		},
	};   
	if (image) {
		embed.image = { url: image };
	}
	fetch(webhookURL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			embeds: [embed],
		}),
	})
		.then(response => {
			if (response.ok) {
				console.log("Changelog sent successfully.");
			} else {
				console.error("Error sending changelog:", response.statusText);
			}
		})
		.catch(error => {
			console.error("An error occurred:", error);
		});

	return new Response(JSON.stringify({ data: "Changelog sent successfully." }), { status: 200 });
};
