<script lang="ts">
	import { pb } from '$lib/pocketbase/index.js';
	import {
		Collections,
		type OrganizationsResponse,
		type ServicesResponse
	} from '$lib/pocketbase/types.js';

	// Components
	import { ProtectedOrgLayout } from '$lib/rbac';
	import Breadcrumbs, { type BreadcrumbRenamer } from '$lib/components/Breadcrumbs.svelte';
	import { Hr } from 'flowbite-svelte';
	import Card from '$lib/components/card.svelte';

	//

	export let data;

	//

	const breadcrumbRenamers: BreadcrumbRenamer[] = [
		{
			sveltekitFolder: '[id]',
			newText: getOrganizationNameById
		},
		{
			sveltekitFolder: '[serviceId]',
			newText: getServiceNameById
		}
	];

	async function getServiceNameById(id: string): Promise<string> {
		const service = await pb.collection(Collections.Services).getOne<ServicesResponse>(id);
		return service.name;
	}

	async function getOrganizationNameById(id: string): Promise<string> {
		const organization = await pb
			.collection(Collections.Organizations)
			.getOne<OrganizationsResponse>(id);
		return organization.name;
	}
</script>

<!--  -->

<Card class="p-8">
	<ProtectedOrgLayout orgId={data.organization.id}>
		<Breadcrumbs renamers={breadcrumbRenamers} />

		<Hr />

		<slot />
	</ProtectedOrgLayout>
</Card>
