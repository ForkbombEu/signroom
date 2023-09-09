import { verifyUser } from '$lib/auth/verifyUser';
import { loadFeatureFlags } from '$lib/features';
import { error, redirect } from '@sveltejs/kit';

export const load = async () => {
	if (!(await loadFeatureFlags()).AUTH) throw error(404);
	if (!(await verifyUser())) throw redirect(303, '/login');
};
