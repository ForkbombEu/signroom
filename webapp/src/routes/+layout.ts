import { features, loadFeatures } from '$lib/features';

export const load = async () => {
	features.set(await loadFeatures());
};
