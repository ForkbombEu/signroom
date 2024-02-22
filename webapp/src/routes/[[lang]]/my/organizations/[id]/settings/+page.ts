import { redirect } from '$lib/i18n';
import { OrgRoles, verifyRole } from '$lib/rbac/index.js';

export const load = async ({ parent, params, fetch, url }) => {
	const { organization } = await parent();

	try {
		await verifyRole(organization.id, [OrgRoles.OWNER], fetch);
	} catch (e) {
		try {
			await verifyRole(organization.id, [OrgRoles.ADMIN], fetch);
		} catch (e) {
			throw redirect(url, `/my/organizations/${params.id}`);
		}
		throw redirect(url, `${url.pathname}/members`);
	}
	throw redirect(url, `${url.pathname}/general`);
};
