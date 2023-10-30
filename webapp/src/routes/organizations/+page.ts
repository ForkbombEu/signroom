import { pb } from '$lib/pocketbase';
import {
	Collections,
	type OrgAuthorizationsResponse,
	type OrganizationsResponse,
	type UsersResponse
} from '$lib/pocketbase/types';

export const load = async ({ fetch }) => {

	const organizations = await pb
		.collection(Collections.Organizations)
		.getFullList<OrganizationsResponse>({
			fetch,
			requestKey: null
		});

	console.log(organizations);

	return { organizations };
};
