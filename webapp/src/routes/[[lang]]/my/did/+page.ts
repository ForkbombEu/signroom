import { getKeyringFromLocalStorage } from '$lib/keypairoom/keypair';
import { loadFeatureFlags } from '$lib/features';
import { pb } from '$lib/pocketbase';
<<<<<<< ours
import { error } from '@sveltejs/kit';
import { redirect } from '$lib/i18n/index.js';

export const load = async ({ fetch, url }) => {
	const { DID, KEYPAIROOM } = await loadFeatureFlags(fetch);
	if (!KEYPAIROOM && !DID) throw error(404);

	const keyring = getKeyringFromLocalStorage();
	if (!keyring) throw redirect(url, '/keypairoom/regenerate');

	const { did } = await pb.send<{ did: JSON }>('/api/did', { fetch });
=======
import { error, redirect } from '@sveltejs/kit';

export const load = async () => {
	const { DID, KEYPAIROOM } = await loadFeatureFlags();
	if (!KEYPAIROOM && !DID) throw error(404);

	const keyring = getKeyringFromLocalStorage();
	if (!keyring) throw redirect(303, '/keypairoom/regenerate');

	const { did } = await pb.send<{ did: JSON }>('/api/did', {});
>>>>>>> theirs
	return { did };
};
