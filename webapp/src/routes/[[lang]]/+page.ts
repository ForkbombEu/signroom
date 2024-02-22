import { redirect } from '$lib/i18n';
import { verifyUser } from '$lib/auth/verifyUser';

export const load = async ({ fetch, url }) => {
	if (await verifyUser(fetch)) throw redirect(url, '/my');
};
