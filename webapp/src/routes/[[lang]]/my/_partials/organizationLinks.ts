import type { SidebarLink } from '$lib/layout';
import type { OrganizationsResponse } from '$lib/pocketbase/types';

export const createOrganizationLinks = (
	org: OrganizationsResponse,
	isAdminOrOwner = false
): SidebarLink[] => {
	const base = (path = '') => `/my/organizations/${org.id}${path}`;

	const subLinks: SidebarLink[] = [
		{
			label: 'Home',
			href: base()
		},
		{
			label: 'Services',
			href: base('/services')
		},
		{
			label: 'Templates',
			href: base('/templates')
		},
		{
			label: 'Servers',
			href: base('/issuers')
		}
	];

	if (isAdminOrOwner) {
		subLinks.push({ label: 'Settings', href: base('/settings') });
		subLinks.push({ label: 'Requests', href: base('/requests') });
	}

	return [
		{
			label: org.name,
			subLinks
		}
	];
};
