import { loadFeatureFlags } from '$lib/features';

export const ssr = false;

export const load = async ({ fetch }) => {
	await loadFeatureFlags(fetch);
};
