<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { CollectionManager, DeleteRecord } from '$lib/collectionManager';
	import { Collections, type IssuersResponse } from '$lib/pocketbase/types';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { Alert, Button, Modal, P, Spinner } from 'flowbite-svelte';
	import { m } from '$lib/i18n';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import CreateRecord from '$lib/collectionManager/ui/recordActions/createRecord.svelte';
	import OrganizationLayout from '$lib/components/organizationLayout.svelte';
	import PageCard from '$lib/components/pageCard.svelte';
	import { ArrowDownTray, Plus, Trash } from 'svelte-heros-v2';
	import Icon from '$lib/components/icon.svelte';
	import PlainCard from '$lib/components/plainCard.svelte';
	import EditRecord from '$lib/collectionManager/ui/recordActions/editRecord.svelte';
	import { Pencil } from 'svelte-heros';
	import { ProtectedOrgUI } from '$lib/rbac';
	import PortalWrapper from '$lib/components/portalWrapper.svelte';
	import { getErrorMessage } from '$lib/errorHandling.js';
	import { requestDownloadMicroservices } from '@api/download-microservices/index.js';
	import { dowloadResponseAsZip } from '$lib/utils/clientFileDownload.js';
	import { getRandomMicroservicePort } from '$lib/microservices';
	import MicroserviceCollectionManager from './_partials/microserviceCollectionManager.svelte';

	//

	export let data;
	let { organization } = data;

	const recordType = createTypeProp<IssuersResponse>();

	//

	let loading = false;
	let error: string | undefined = undefined;

	async function handleDownloadMicroservices() {
		error = undefined;
		loading = true;
		try {
			await downloadMicroservices(organization.id);
		} catch (e) {
			error = getErrorMessage(e);
		}
		loading = false;
	}

	async function downloadMicroservices(organizationId: string, fetchFn = fetch) {
		const response = await requestDownloadMicroservices(organizationId, fetchFn);
		if (!response.ok) throw new Error(response.statusText);
		dowloadResponseAsZip(response, 'microservices.zip');
	}

	//
</script>

<OrganizationLayout org={data.organization}>
	<div class="space-y-10">
		<ProtectedOrgUI orgId={organization.id} roles={['admin', 'owner']}>
			<PageCard class="flex items-center justify-between gap-8 !space-y-0 py-5">
				<p class="text-sm text-gray-500">{m.download_microservices_description()}</p>
				<div class="flex items-center gap-4">
					{#if error}
						<Alert title="Error" color="red" class="py-2" dismissable>{error}</Alert>
					{/if}
					<Button on:click={handleDownloadMicroservices}>
						{m.Download_microservices()}<Icon src={ArrowDownTray} ml />
					</Button>
				</div>
			</PageCard>
		</ProtectedOrgUI>

		<PageCard>
			<MicroserviceCollectionManager
				microserviceType={Collections.Issuers}
				organizationId={organization.id}
			/>
		</PageCard>

		<PageCard>
			<MicroserviceCollectionManager
				microserviceType={Collections.AuthorizationServers}
				organizationId={organization.id}
			/>
		</PageCard>

		<PageCard>
			<MicroserviceCollectionManager
				microserviceType={Collections.RelyingParties}
				organizationId={organization.id}
			/>
		</PageCard>
	</div>
</OrganizationLayout>

<PortalWrapper>
	<Modal open={loading} dismissable={false} class="w-fit">
		<div class="flex flex-col items-center justify-center text-sm">
			<Spinner />
			<p class="mt-4 font-bold">{m.Downloading_microservices()}</p>
			<p>P{m.Please_wait()}</p>
		</div>
	</Modal>
</PortalWrapper>
