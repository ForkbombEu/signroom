import { loadFeatureFlags } from '$lib/features';
import { error } from '@sveltejs/kit';

export const ssr = false;

export const load = async ({ fetch }) => {
	const flags = await loadFeatureFlags(fetch);
	if (flags.MAINTENANCE) {
		throw error(503);
	}
};
