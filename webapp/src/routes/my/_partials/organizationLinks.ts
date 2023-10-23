import type { SidebarLink } from '$lib/layout';
import type { OrganizationsResponse } from '$lib/pocketbase/types';

export const createOrganizationLinks = (
	org: OrganizationsResponse,
	showSettings: boolean = false
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
			label: 'Issuers',
			href: base('/issuers')
		}
	];

	if (showSettings) subLinks.push({ label: 'Settings', href: base('/settings') });

	return [
		{
			label: org.name,
			subLinks
		}
	];
};
