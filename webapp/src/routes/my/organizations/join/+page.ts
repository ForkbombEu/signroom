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
			requestKey: null
		});

	const orgAuthorizations = await pb
		.collection(Collections.OrgAuthorizations)
		.getFullList<OrgAuthorizationsResponse<{ organization: OrganizationsResponse }>>({
			filter: `user.id = "${user.id}"`,
			expand: 'organization',
			fetch,
			requestKey: null
		});

	console.log(orgAuthorizations);

	const joinedOrganizationsIdsFilter = orgAuthorizations
		.map((authorization) => {
			return authorization.expand?.organization.id;
		})
		.filter((id) => Boolean(id))
		.map((id) => `id != "${id}"`)
		.join(' && ');

	console.log(joinedOrganizationsIdsFilter);

	const organizations = await pb
		.collection(Collections.Organizations)
		.getFullList<OrganizationsResponse>({
			filter: joinedOrganizationsIdsFilter,
			fetch,
			requestKey: null
		});

	console.log(organizations);

	return { organizations, orgJoinRequests };
};
