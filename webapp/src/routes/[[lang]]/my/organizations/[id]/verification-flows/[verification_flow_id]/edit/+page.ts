import { verifyRole } from '$lib/rbac/index.js';
import { error } from '@sveltejs/kit';

export const load = async ({ params, fetch }) => {
	try {
		await verifyRole(params.id, ['admin', 'owner'], fetch);
	} catch (e) {
		throw error(404);
	}
};
