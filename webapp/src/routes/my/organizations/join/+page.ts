import { pb } from '$lib/pocketbase';
import {
	Collections,
	type OrgAuthorizationsResponse,
	type OrganizationsResponse,
	type UsersResponse
} from '$lib/pocketbase/types';

export const load = async () => {
	const user = pb.authStore.model as UsersResponse; // assuming the user exists

	const orgAuthorizations = await pb
		.collection(Collections.OrgAuthorizations)
		.getFullList<OrgAuthorizationsResponse<{ organization: OrganizationsResponse }>>({
			filter: `user.id = "${user.id}"`,
			expand: 'organization'
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
			filter: joinedOrganizationsIdsFilter
		});

	console.log(organizations);

	return { organizations };
};
