import { error, redirect } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';
import { featuresNames, isFeatureActive, loadFeatures } from '$lib/features';

export const load = async () => {
	if (!isFeatureActive(await loadFeatures(), featuresNames.AUTH)) {
		throw error(404, 'Not found');
	}
	if (pb.authStore.model) {
		throw redirect(303, '/my');
	}
};
