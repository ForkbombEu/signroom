<script lang="ts">
	import { pb } from '$lib/pocketbase/index.js';
	import {
		Collections,
		type OrganizationsResponse,
		type ServicesResponse
	} from '$lib/pocketbase/types.js';

	// Components
	import { ProtectedOrgLayout } from '$lib/rbac';
	import Breadcrumbs, { type BreadcrumbsOptions } from '$lib/components/Breadcrumbs.svelte';
	import { Hr } from 'flowbite-svelte';

	import { m } from '$lib/i18n';

	//

	export let data;

	//

	const breadcrumbsOptions: BreadcrumbsOptions = {
		renamers: {
			'[id]': getOrganizationNameById,
			'[issuance_id]': getServiceNameById,
			organizations: () => m.organizations(),
			'credential-issuances': () => m.Credential_issuances(),
			my: () => m.My()
		},
		exclude: ['[[lang]]']
	};

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
	<Breadcrumbs options={breadcrumbsOptions} />

	<Hr />

	<slot />
</ProtectedOrgLayout>
