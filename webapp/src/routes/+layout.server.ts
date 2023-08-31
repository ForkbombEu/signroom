import { MAINTENANCE } from '$env/static/private';
import { features, loadFeatures } from '$lib/features';
import { error } from '@sveltejs/kit';

export const ssr = false;

export const load = async () => {
	const feats = await loadFeatures();
	if (feats.find((f) => f.name === 'maintenance')?.active || MAINTENANCE === 'true') {
		throw error(503);
	}
	features.set(feats);
};
