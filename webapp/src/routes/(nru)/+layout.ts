import { error, redirect } from '@sveltejs/kit';
import { loadFeatureFlags } from '$lib/features';
import { verifyUser } from '$lib/auth/verifyUser';

export const load = async ({ fetch }) => {
	if (!(await loadFeatureFlags(fetch)).AUTH) throw error(404);
	if (await verifyUser(fetch)) throw redirect(303, '/my');
};
