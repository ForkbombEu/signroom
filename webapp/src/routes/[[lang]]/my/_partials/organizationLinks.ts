import type { SidebarLink } from '$lib/layout';
import type { OrganizationsResponse } from '$lib/pocketbase/types';
import type { m as messages } from '$lib/i18n';

export const createOrganizationLinks = (
	org: OrganizationsResponse,
	m: typeof messages,
	isAdminOrOwner = false
): SidebarLink[] => {
	const base = (path = '') => `/my/organizations/${org.id}${path}`;

	const subLinks: SidebarLink[] = [
		{
			label: m.Home(),
			href: base()
		},
		{
			label: m.Credential_issuances(),
			href: base('/services')
		},
		{
			label: m.Credential_templates(),
			href: base('/credential-templates')
		},
		{
			label: m.Microservices(),
			href: base('/microservices')
		}
	];

	if (isAdminOrOwner) {
		subLinks.push({
			label: m.Organization_settings(),
			href: base('/settings')
		});

		subLinks.push({
			label: m.Membership_requests(),
			href: base('/requests')
		});
	}

	return [
		{
			label: org.name,
			subLinks
		}
	];
};
