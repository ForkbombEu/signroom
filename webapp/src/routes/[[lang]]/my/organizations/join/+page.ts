// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { pb } from '$lib/pocketbase';
import {
	type OrgAuthorizationsResponse,
	type OrganizationsResponse,
	type UsersResponse
} from '$lib/pocketbase/types';

export const load = async ({ fetch }) => {
	const user = pb.authStore.model as UsersResponse; // assuming the user exists

	const orgJoinRequests = await pb.collection('orgJoinRequests').getFullList({
		filter: `user.id = "${user.id}"`,
		requestKey: null,
		fetch
	});

	const orgAuthorizations = await pb
		.collection('orgAuthorizations')
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

	const organizations = await pb.collection('organizations').getFullList({
		filter: joinedOrganizationsIdsFilter,
		fetch,
		requestKey: null
	});

	return { organizations, orgJoinRequests };
};
