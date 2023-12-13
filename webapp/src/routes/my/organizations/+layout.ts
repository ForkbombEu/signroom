import { loadFeatureFlags } from '$lib/features';
import { error } from '@sveltejs/kit';

export const load = async ({ fetch }) => {
	if (!(await loadFeatureFlags(fetch)).ORGANIZATIONS) throw error(404);
};
