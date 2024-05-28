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

	if (!featureFlags.AUTH) error(404);
	if (!(await verifyUser(fetch))) redirect('/login', url);

	if (featureFlags.KEYPAIROOM) {
		const publicKeys = await getUserPublicKeys();
		if (!publicKeys) {
			redirect(`/keypairoom?${welcomeSearchParamKey}`, url);
			return;
		}

		if (browser) {
			const keyring = getKeyringFromLocalStorage();
			if (!keyring) {
				redirect(`/keypairoom/regenerate?${missingKeyringParam}`, url);
				return;
			}

			try {
				await matchPublicAndPrivateKeys(publicKeys, keyring);
			} catch (e) {
				redirect(`/keypairoom/regenerate?${missingKeyringParam}`, url);
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
