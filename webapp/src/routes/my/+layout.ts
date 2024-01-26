import { verifyUser } from '$lib/auth/verifyUser';
import { loadFeatureFlags } from '$lib/features';
import { error, redirect } from '@sveltejs/kit';

import { pb } from '$lib/pocketbase';
import {
	Collections,
	type OrgAuthorizationsResponse,
	type OrgRolesResponse,
	type OrganizationsResponse
} from '$lib/pocketbase/types';
import { browser } from '$app/environment';
import { getKeyringFromLocalStorage } from '$lib/keypairoom/keypair';
import { missingKeyringParam, welcomeSearchParamKey } from '$lib/utils/constants';

export const load = async ({ url }) => {
	const featureFlags = await loadFeatureFlags();

	if (!featureFlags.AUTH) throw error(404);
	if (!(await verifyUser())) throw redirect(303, '/login');

	if (featureFlags.KEYPAIROOM && browser) {
		const keyring = getKeyringFromLocalStorage();
		if (!keyring) {
			const isWelcome = url.searchParams.has(welcomeSearchParamKey);
			if (isWelcome) throw redirect(303, `/keypairoom?${url.searchParams.toString()}`);
			else throw redirect(303, `/keypairoom/regenerate?${missingKeyringParam}`);
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
				expand: 'organization,role'
			});

		return { authorizations };
	}
};
