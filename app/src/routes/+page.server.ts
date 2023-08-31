import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
	// const session = await getSession();
	return { url: url.origin };
};