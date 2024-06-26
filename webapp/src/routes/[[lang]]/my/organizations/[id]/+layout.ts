import { pb } from '$lib/pocketbase';
import { Collections, type OrganizationsResponse } from '$lib/pocketbase/types';

export const load = async ({ params, fetch }) => {
	const organizationId = params.id;
	const organization = await pb
		.collection(Collections.Organizations)
		.getOne<OrganizationsResponse>(organizationId, {
			fetch,
			requestKey: null
		});

	return { organization };
};
