// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { pb } from '$lib/pocketbase';
import {
	Collections,
	type OrgAuthorizationsResponse,
	type OrgJoinRequestsResponse,
	type OrganizationsResponse,
	type UsersResponse
} from '$lib/pocketbase/types';

export const load = async ({ fetch }) => {
	const user = pb.authStore.model as UsersResponse; // assuming the user exists

	const orgJoinRequests = await pb
		.collection(Collections.OrgJoinRequests)
		.getFullList<OrgJoinRequestsResponse>({
			filter: `user.id = "${user.id}"`,
			requestKey: null,
			fetch
		});

	const orgAuthorizations = await pb
		.collection(Collections.OrgAuthorizations)
		.getFullList<OrgAuthorizationsResponse<{ organization: OrganizationsResponse }>>({
			filter: `user.id = "${user.id}"`,
			expand: 'organization',
			fetch,
			requestKey: null
		});

	const joinedOrganizationsIdsFilter = orgAuthorizations
		.map((authorization) => {
			return authorization.expand?.organization.id;
		})
		.filter((id) => Boolean(id))
		.map((id) => `id != "${id}"`)
		.join(' && ');

	const organizations = await pb
		.collection(Collections.Organizations)
		.getFullList<OrganizationsResponse>({
			filter: joinedOrganizationsIdsFilter,
			fetch,
			requestKey: null
		});

	return { organizations, orgJoinRequests };
};
