<script lang="ts">
	import { m } from '$lib/i18n';
	import { currentUser } from '$lib/pocketbase';
	import { getUserRole, type OrgRole } from '$lib/rbac';
	import { createOrganizationLinks } from '$lib/utils/organizations';
	import type { NavigationTabProps } from './navigationTab.svelte';
	import NavigationTabs from './navigationTabs.svelte';

	export let organizationId: string;

	//

	let userRole: OrgRole = 'member';

	$: getUserRole(organizationId, $currentUser?.id ?? '').then((res) => {
		userRole = res;
	});

	//

	let tabs: NavigationTabProps[] = [];

	$: tabs = createOrganizationLinks(organizationId, m, userRole);
</script>

{#key tabs}
	<NavigationTabs {tabs}></NavigationTabs>
{/key}
