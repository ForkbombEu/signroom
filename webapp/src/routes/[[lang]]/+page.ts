import { redirect } from '@sveltejs/kit';
import { verifyUser } from '$lib/auth/verifyUser';
import { resolveRoute } from '$lib/i18n/index.js';

export const load = async ({ fetch, url }) => {
	if (await verifyUser(fetch)) throw redirect(303, resolveRoute('/my', url));
};
