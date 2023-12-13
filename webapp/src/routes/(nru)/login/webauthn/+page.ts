import { loadFeatureFlags } from '$lib/features';
import { error } from '@sveltejs/kit';

export const load = async ({ fetch }) => {
	const { WEBAUTHN } = await loadFeatureFlags(fetch);
	if (!WEBAUTHN) {
		throw error(404);
	}
};
