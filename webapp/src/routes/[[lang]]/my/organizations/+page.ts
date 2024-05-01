<<<<<<< ours
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
=======
import { pb } from '$lib/pocketbase';
import {
	Collections,
	type OrgAuthorizationsResponse,
	type OrgRolesResponse,
	type OrganizationsResponse
} from '$lib/pocketbase/types';

export const load = async () => {
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
>>>>>>> theirs
};
