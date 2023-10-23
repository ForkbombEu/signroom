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

	const href = (path = '', i = 0) => {
		let p = '';
		Array.from(Array(i).keys()).forEach((x) => {
			p = `${p}/${pathFragments[x]}`;
			console.log(p, i);
		});
		return `/my/organizations/${organization.id}${p}${path}`;
	};
	$: pathFragments = (activeUrl && activeUrl.split(`${organization.id}/`)[1]?.split('/')) || [];
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
		<BreadcrumbItem href={href()}>{organization.name}</BreadcrumbItem>
		{#each pathFragments as link, i}
			<BreadcrumbItem href={href(`/${link}`, i)}>{link}</BreadcrumbItem>
		{/each}
	</Breadcrumb>
</ProtectedOrgLayout>
<Hr />

<ProtectedOrgLayout orgId={organization.id}>
	<slot />
</ProtectedOrgLayout>
