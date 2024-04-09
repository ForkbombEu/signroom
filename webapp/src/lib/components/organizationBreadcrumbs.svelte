<script lang="ts">
	import { m } from '$lib/i18n';
	import { pb } from '$lib/pocketbase';
	import {
		Collections,
		type OrganizationsResponse,
		type ServicesResponse,
		type VerificationFlowsResponse
	} from '$lib/pocketbase/types';
	import type { BreadcrumbsOptions } from './Breadcrumbs.svelte';
	import Breadcrumbs from './Breadcrumbs.svelte';

	//

	const breadcrumbsOptions: BreadcrumbsOptions = {
		renamers: {
			'[id]': getOrganizationNameById,
			'[issuance_id]': getServiceNameById,
			organizations: () => m.organizations(),
			'credential-issuances': () => m.Credential_issuances(),
			'[verification_flow_id]': getVerificationFlowNameById,
			my: () => m.My()
		},
		exclude: ['[[lang]]']
	};

	//

	async function getServiceNameById(id: string): Promise<string> {
		const service = await pb.collection(Collections.Services).getOne<ServicesResponse>(id);
		return service.display_name;
	}

	async function getOrganizationNameById(id: string): Promise<string> {
		const organization = await pb
			.collection(Collections.Organizations)
			.getOne<OrganizationsResponse>(id);
		return organization.name;
	}

	async function getVerificationFlowNameById(id: string): Promise<string> {
		const verificationFlow = await pb
			.collection(Collections.VerificationFlows)
			.getOne<VerificationFlowsResponse>(id);
		return verificationFlow.name;
	}
</script>

<Breadcrumbs options={breadcrumbsOptions} />
