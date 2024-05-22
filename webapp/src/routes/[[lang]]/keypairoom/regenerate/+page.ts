import { loadFeatureFlags } from '$lib/features';
import { getUserPublicKeys } from '$lib/keypairoom/utils';
import { welcomeSearchParam } from '$lib/utils/constants';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
	const { KEYPAIROOM, AUTH } = await loadFeatureFlags();

	if (KEYPAIROOM && AUTH) {
		const publicKeys = await getUserPublicKeys();
		if (!publicKeys) throw redirect(303, `/my/keypairoom?${welcomeSearchParam}`);
	}
};
