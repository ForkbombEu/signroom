<script lang="ts">
	import { page } from '$app/stores';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { pb } from '$lib/pocketbase';
	import { ProtectedOrgLayout } from '$lib/rbac';
	import { Hr } from 'flowbite-svelte';
	import { UserGroup } from 'svelte-heros-v2';

	export let data;
	$: organization = data.organization;
	$: avatarPath = pb.files.getUrl(organization, organization.avatar);
	$: activeUrl = $page.url.pathname;
	$: pathFragments = activeUrl?.split(`${organization.id}/`)[1]?.split('/') || [];
	let breadcrumbItems:{label:string, href:string}[] = []

	$: {
		breadcrumbItems = [
			{ label: 'Organizations', href: '/my/organizations' },
			{ label: organization?.name, href: `/my/organizations/${organization?.id}` }
		];

		pathFragments?.forEach((fragment, i) => {
			breadcrumbItems.push({
				label: fragment,
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
