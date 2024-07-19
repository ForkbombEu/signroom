<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { m } from '$lib/i18n';
	import { pb } from '$lib/pocketbase';
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
		const service = await pb.collection('services').getOne(id);
		return service.display_name;
	}

	async function getOrganizationNameById(id: string): Promise<string> {
		const organization = await pb.collection('organizations').getOne(id);
		return organization.name;
	}

	async function getVerificationFlowNameById(id: string): Promise<string> {
		const verificationFlow = await pb.collection('verification_flows').getOne(id);
		return verificationFlow.name;
	}
</script>

<Breadcrumbs options={breadcrumbsOptions} />
