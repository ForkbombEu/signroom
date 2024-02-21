import { resolveRoute } from '$lib/i18n';
import { OrgRoles, verifyRole } from '$lib/rbac/index.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ parent, params, fetch, url }) => {
	const { organization } = await parent();

	try {
		await verifyRole(organization.id, [OrgRoles.OWNER], fetch);
	} catch (e) {
		try {
			await verifyRole(organization.id, [OrgRoles.ADMIN], fetch);
		} catch (e) {
			throw redirect(303, resolveRoute(`/my/organizations/${params.id}`, url));
		}
		throw redirect(303, resolveRoute(`${url.pathname}/members`, url));
	}
	throw redirect(303, resolveRoute(`${url.pathname}/general`, url));
};
