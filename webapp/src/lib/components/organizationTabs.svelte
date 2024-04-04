<script lang="ts">
	import { m } from '$lib/i18n';
	import NavigationTabs, { type NavigationTab } from './navigationTabs.svelte';
	import { Fire, GlobeAlt, Cog, Users, Home } from 'svelte-heros-v2';

	export let organizationId: string;

	const base = (path = '') => `/my/organizations/${organizationId}${path}`;

	let tabs: NavigationTab[] = [
		{
			label: m.Home(),
			href: base(),
			icon: Home,
			activeForSubpages: false
		},
		{
			label: m.Credential_issuances(),
			href: base('/credential-issuances'),
			icon: Fire
		},
		{
			label: m.Microservices(),
			href: base('/microservices'),
			icon: GlobeAlt
		},
		{
			label: m.Members(),
			href: base('/settings/members'),
			icon: Users
		},
		{
			label: m.Settings(),
			href: base('/settings'),
			icon: Cog
		}
	];
</script>

<NavigationTabs {tabs}></NavigationTabs>
