import { verifyUser } from '$lib/auth/verifyUser';
import { featuresNames, isFeatureActive, loadFeatures } from '$lib/features';
import { error, redirect } from '@sveltejs/kit';

export const load = async () => {
	if (!isFeatureActive(await loadFeatures(), featuresNames.AUTH)) throw error(404);
	if (!(await verifyUser())) throw redirect(303, '/login');
};
