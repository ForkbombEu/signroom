import { pb } from '$lib/pocketbase';
import { Collections, type OrganizationsResponse } from '$lib/pocketbase/types';

<<<<<<< ours
export const load = async ({ params, fetch }) => {
	const organizationId = params.id;
	const organization = await pb
		.collection(Collections.Organizations)
		.getOne<OrganizationsResponse>(organizationId, {
			fetch,
			requestKey: null
		});
=======
export const load = async ({ params }) => {
	const organizationId = params.id;
	const organization = await pb
		.collection(Collections.Organizations)
		.getOne<OrganizationsResponse>(organizationId);
>>>>>>> theirs

	return { organization };
};
