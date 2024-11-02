<script lang="ts">
	import OrganizationBreadcrumbs from './organizationBreadcrumbs.svelte';
	import { PageTop, PageContent } from '@/components/layout';
	import OrganizationTabs from './organizationTabs.svelte';
	import type { OrganizationsResponse } from '@/pocketbase/types';
	import T from '@/components/custom/t.svelte';

	export let org: OrganizationsResponse;
</script>

<PageTop>
	<OrganizationBreadcrumbs />
	<T tag="h4">{org.name}</T>
	<OrganizationTabs slot="bottom" organizationId={org.id} />
</PageTop>

<PageContent>
	<slot />
</PageContent>
