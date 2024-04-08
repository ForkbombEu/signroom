<script lang="ts">
	import { m } from '$lib/i18n';
	import { OrgRoles, verifyRole } from '$lib/rbac';
	import { createOrganizationLinks } from '$lib/utils/organizations';
	import NavigationTabs from './navigationTabs.svelte';

	export let organizationId: string;

	let isOwner = false;

	verifyRole(organizationId, [OrgRoles.OWNER])
		.then(() => {
			isOwner = true;
		})
		.catch(() => {
			isOwner = false;
		});

	$: tabs = createOrganizationLinks(organizationId, m, isOwner);
</script>

<NavigationTabs {tabs}></NavigationTabs>
