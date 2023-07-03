import { error, redirect } from '@sveltejs/kit';
import { featuresNames, isFeatureActive, loadFeatures } from '$lib/features';
import { verifyUser } from '$lib/auth/verifyUser';

export const load = async () => {
	if (!isFeatureActive(await loadFeatures(), featuresNames.AUTH)) throw error(404);
	if (await verifyUser()) throw redirect(303, '/my');
};
