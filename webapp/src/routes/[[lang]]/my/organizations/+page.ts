// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { pb } from '$lib/pocketbase/index.js';
import {
	Collections,
	OrgJoinRequestsStatusOptions,
	type OrgJoinRequestsResponse,
	type UsersResponse,
	type OrganizationsResponse
} from '$lib/pocketbase/types.js';

export const load = async ({ fetch }) => {
	const user = pb.authStore.model as UsersResponse;
	const orgJoinRequests = await pb
		.collection(Collections.OrgJoinRequests)
		.getFullList<OrgJoinRequestsResponse<{ organization: OrganizationsResponse }>>({
			fetch,
			filter: `user.id = "${user.id}" && status = "${OrgJoinRequestsStatusOptions.pending}"`,
			expand: 'organization'
		});
	return { orgJoinRequests };
};
