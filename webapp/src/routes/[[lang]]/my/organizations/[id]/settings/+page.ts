import { verifyUserRole } from '$lib/organizations/index.js';
import { error } from '@sveltejs/kit';

export const load = async ({ params, fetch }) => {
	const organizationId = params.id;
	const { hasRole } = await verifyUserRole(organizationId, ['owner'], fetch);
	if (!hasRole) error(404);
};
