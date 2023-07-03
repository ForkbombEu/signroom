import { getKeyringFromLocalStorage } from '$lib/keypairoom/keypair';
import { featuresNames, isFeatureActive, loadFeatures } from '$lib/features';
import { pb } from '$lib/pocketbase';
import { error, redirect } from '@sveltejs/kit';

export const load = async () => {
	const features = await loadFeatures();
	if (!isFeatureActive(features, featuresNames.KEYPAIROOM)) throw error(404);
	if (!isFeatureActive(features, featuresNames.DID)) throw error(404);

	const keyring = getKeyringFromLocalStorage();
	if (!keyring) throw redirect(303, '/keypairoom/regenerate');

	const { did } = await pb.send<{ did: JSON }>('/api/did', {});
	return { did };
};
