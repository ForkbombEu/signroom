<script lang="ts">
	import { Heading } from 'flowbite-svelte';
	import OrganizationBreadcrumbs from './organizationBreadcrumbs.svelte';
	import PageTop from './pageTop.svelte';
	import OrganizationTabs from './organizationTabs.svelte';
	import type { OrganizationsResponse } from '$lib/pocketbase/types';
	import PageContent from './pageContent.svelte';

	export let org: OrganizationsResponse;
</script>

<PageTop>
	<OrganizationBreadcrumbs />
	<Heading tag="h4">{org.name}</Heading>
	<OrganizationTabs slot="bottom" organizationId={org.id} />
</PageTop>

<PageContent>
	<slot />
</PageContent>
