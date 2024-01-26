<script lang="ts">
	import { page } from '$app/stores';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { ProtectedOrgLayout } from '$lib/rbac';
	import type { Link } from '$lib/utils/types.js';
	import { Hr } from 'flowbite-svelte';
	import { UserGroup } from 'svelte-heros-v2';

	export let data;
	$: organization = data.organization;
	$: activeUrl = $page.url.pathname;

	$: pathFragments = activeUrl?.split(`${organization.id}/`)[1]?.split('/') || [];
	let breadcrumbItems: Link[] = [];

	$: {
		breadcrumbItems = [
			{ text: 'Organizations', href: '/my/organizations' },
			{ text: organization?.name, href: `/my/organizations/${organization?.id}` }
		];

		pathFragments?.forEach((fragment, i) => {
			breadcrumbItems.push({
				text: fragment,
				href: `/my/organizations/${organization?.id}/${pathFragments.slice(0, i + 1).join('/')}`
			});
		});
	}
</script>

<!--  -->

<ProtectedOrgLayout orgId={organization.id}>
	<Breadcrumb items={breadcrumbItems} homeIcon={UserGroup} />

	<Hr />

	<slot />
</ProtectedOrgLayout>
