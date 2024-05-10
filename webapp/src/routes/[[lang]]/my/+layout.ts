import { verifyUser } from '$lib/auth/verifyUser';
import { loadFeatureFlags } from '$lib/features';
import { error } from '@sveltejs/kit';

import { browser } from '$app/environment';
import { redirect } from '$lib/i18n';
import { getKeyringFromLocalStorage, matchPublicAndPrivateKeys } from '$lib/keypairoom/keypair';
import { getUserPublicKeys } from '$lib/keypairoom/utils';
import { pb } from '$lib/pocketbase';
import {
	Collections,
	type OrgAuthorizationsResponse,
	type OrgRolesResponse,
	type OrganizationsResponse
} from '$lib/pocketbase/types';
import { missingKeyringParam, welcomeSearchParamKey } from '$lib/utils/constants';

export const load = async ({ url, fetch }) => {
	const featureFlags = await loadFeatureFlags();

	if (!featureFlags.AUTH) throw error(404);
	if (!(await verifyUser(fetch))) throw redirect(url, '/login');


	if (featureFlags.KEYPAIROOM) {
		const publicKeys = await getUserPublicKeys();
		if (!publicKeys) {
			throw redirect(303, `/keypairoom?${welcomeSearchParamKey}`);
		}

		if (browser) {
			const keyring = getKeyringFromLocalStorage();
			if (!keyring) {
				throw redirect(303, `/keypairoom/regenerate?${missingKeyringParam}`);
			}

			try {
				await matchPublicAndPrivateKeys(publicKeys, keyring);
			} catch (e) {
				throw redirect(303, `/keypairoom/regenerate?${missingKeyringParam}`);
			}
 		}
 	}

	if (featureFlags.ORGANIZATIONS) {
		type Authorizations = Required<
			OrgAuthorizationsResponse<{
				organization: OrganizationsResponse;
				role: OrgRolesResponse;
			}>
		>;

		const authorizations = await pb
			.collection(Collections.OrgAuthorizations)
			.getFullList<Authorizations>({
				filter: `user = "${pb.authStore.model!.id}"`,
				expand: 'organization,role',
				fetch,
				requestKey: null
			});

		return { authorizations };
	}
};
