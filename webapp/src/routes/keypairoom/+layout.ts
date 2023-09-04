import { loadFeatureFlags } from '$lib/features';
import { error } from '@sveltejs/kit';

export const load = async () => {
	if (!(await loadFeatureFlags()).KEYPAIROOM) throw error(404);
};
