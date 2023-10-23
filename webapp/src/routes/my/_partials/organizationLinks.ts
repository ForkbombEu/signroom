import type { SidebarLink } from '$lib/layout';
import { pb } from '$lib/pocketbase';
import type { OrganizationsResponse } from '$lib/pocketbase/types';

export const createOrganizationLinks = (org: OrganizationsResponse): SidebarLink[] => {
	const base = (path = '') => `/my/organizations/${org.id}${path}`;

	return [
		{
			label: org.name,
			subLinks: [
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
			]
		}
	];
};
