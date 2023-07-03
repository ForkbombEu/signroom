import { features, loadFeatures } from '$lib/features';

export const ssr = false;

export const load = async () => {
	features.set(await loadFeatures());
};
