import { loadFeatureFlags } from '$lib/features';
import { error } from '@sveltejs/kit';

<<<<<<< ours
export const load = async ({ fetch }) => {
	const { WEBAUTHN } = await loadFeatureFlags(fetch);
=======
export const load = async () => {
	const { WEBAUTHN } = await loadFeatureFlags();
>>>>>>> theirs
	if (!WEBAUTHN) {
		throw error(404);
	}
};
