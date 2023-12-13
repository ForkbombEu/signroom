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

export const load = async ({ fetch }) => {
	const featureFlags = await loadFeatureFlags(fetch);

	if (!featureFlags.AUTH) throw error(404);
	if (!(await verifyUser(fetch))) throw redirect(303, '/login');

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
				fetch
			});

		return { authorizations };
	}
};
