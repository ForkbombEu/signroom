import { isFeatureActive, loadFeatures, featuresNames } from '$lib/features';
import { error } from '@sveltejs/kit';

export const load = async () => {
	if (!isFeatureActive(await loadFeatures(), featuresNames.KEYPAIROOM)) throw error(404);
};
