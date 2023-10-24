import { OrgRoles, verifyRole } from '$lib/rbac/index.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ url, parent, params }) => {
	const { organization } = await parent();

	try {
		await verifyRole(organization.id, [OrgRoles.OWNER]);
	} catch (e) {
		try {
			await verifyRole(organization.id, [OrgRoles.ADMIN]);
		} catch (e) {
			throw redirect(303, `/my/organizations/${params.id}`);
		}
		throw redirect(303, `${url.pathname}/members`);
	}
	throw redirect(303, `${url.pathname}/general`);
};
