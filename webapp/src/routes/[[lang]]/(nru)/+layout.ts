<<<<<<< ours
import { error } from '@sveltejs/kit';
import { loadFeatureFlags } from '$lib/features';
import { verifyUser } from '$lib/auth/verifyUser';
import { redirect } from '$lib/i18n';

export const load = async ({ fetch, url }) => {
	if (!(await loadFeatureFlags(fetch)).AUTH) throw error(404);
	if (await verifyUser(fetch)) throw redirect(url, '/my');
=======
import { error, redirect } from '@sveltejs/kit';
import { loadFeatureFlags } from '$lib/features';
import { verifyUser } from '$lib/auth/verifyUser';

export const load = async () => {
	if (!(await loadFeatureFlags()).AUTH) throw error(404);
	if (await verifyUser()) throw redirect(303, '/my');
>>>>>>> theirs
};
