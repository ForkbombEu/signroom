<script lang="ts">
	import { pb } from '$lib/pocketbase/index.js';
	import {
		Collections,
		type OrganizationsResponse,
		type ServicesResponse
	} from '$lib/pocketbase/types.js';

	// Components
	import { ProtectedOrgLayout } from '$lib/rbac';
	import Breadcrumbs, { type BreadcrumbParamRenamer } from '$lib/components/Breadcrumbs.svelte';
	import { Hr } from 'flowbite-svelte';

	//

	export let data;

	//

	const breadcrumbParamRenamers: BreadcrumbParamRenamer[] = [
		{
			param: 'id',
			renamer: getOrganizationNameById
		},
		{
			param: 'issuance_id',
			renamer: getServiceNameById
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

<ProtectedOrgLayout orgId={data.organization.id}>
	<Breadcrumbs paramRenamers={breadcrumbParamRenamers} />

	<Hr />

	<slot />
</ProtectedOrgLayout>
