<script lang="ts">
	import { page } from '$app/stores';
	import { pb } from '$lib/pocketbase';
	import { ProtectedOrgLayout } from '$lib/rbac';
	import { Breadcrumb, BreadcrumbItem, Hr } from 'flowbite-svelte';
	import { UserGroup } from 'svelte-heros-v2';

	export let data;
	$: organization = data.organization;
	$: avatarPath = pb.files.getUrl(organization, organization.avatar);
	$: activeUrl = $page.url.pathname;

	const getHref = (pathFragments: string[] = []) => {
		return `/my/organizations/${organization.id}/${pathFragments.join('/')}`;
	};
	$: pathFragments = activeUrl?.split(`${organization.id}/`)[1]?.split('/') || [];
</script>

<!--  -->

<ProtectedOrgLayout orgId={organization.id}>
	<Breadcrumb aria-label="breadcrumb">
		<BreadcrumbItem href="/my/organizations" home>
			<svelte:fragment slot="icon">
				<UserGroup class="w-5 h-5 mr-2" />
			</svelte:fragment>
			Organizations</BreadcrumbItem
		>
		<BreadcrumbItem href={getHref()}>{organization.name}</BreadcrumbItem>
		{#each pathFragments as fragment, i}
			<BreadcrumbItem href={getHref(pathFragments.slice(0, i + 1))}>{fragment}</BreadcrumbItem>
		{/each}
	</Breadcrumb>
</ProtectedOrgLayout>
<Hr />

<ProtectedOrgLayout orgId={organization.id}>
	<slot />
</ProtectedOrgLayout>
