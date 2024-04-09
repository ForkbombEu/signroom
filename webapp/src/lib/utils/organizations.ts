import type { OrganizationsResponse } from '$lib/pocketbase/types';
import type { m as messages } from '$lib/i18n';
import type { NavigationTab } from '$lib/components/navigationTabs.svelte';
import { Cog, Document, Fire, GlobeAlt, HandRaised, Home, Users } from 'svelte-heros-v2';
import type { SidebarItemProps } from '$lib/layout/SidebarLinks.svelte';
import { pb } from '$lib/pocketbase';

export function createOrganizationLinks(
	organizationId: string,
	m: typeof messages,
	isOwner: boolean
): NavigationTab[] {
	const base = (path = '') => `/my/organizations/${organizationId}${path}`;

	const links: NavigationTab[] = [
		{
			text: m.Home(),
			href: base(),
			icon: Home,
			activeForSubpages: false
		},
		{
			text: m.Issuance_flows(),
			href: base('/credential-issuances'),
			icon: Fire
		},
		{
			text: m.Verification_flows(),
			href: base('/verification-flows'),
			icon: HandRaised
		},
		{
			text: m.Templates(),
			href: base('/credential-templates'),
			icon: Document
		},
		{
			text: m.Microservices(),
			href: base('/microservices'),
			icon: GlobeAlt
		},
		{
			text: m.Members(),
			href: base('/members'),
			icon: Users
		}
	];

	if (isOwner) {
		links.push({
			text: m.Settings(),
			href: base('/settings'),
			icon: Cog
		});
	}

	return links;
}

export function createOrganizationSidebarLinks(
	org: OrganizationsResponse,
	m: typeof messages,
	isOwner = false
): SidebarItemProps[] {
	return [
		{
			text: org.name,
			subLinks: createOrganizationLinks(org.id, m, isOwner),
			icon: pb.getFileUrl(org, org.avatar)
		}
	];
}
