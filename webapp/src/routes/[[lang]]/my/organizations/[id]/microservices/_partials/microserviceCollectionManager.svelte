<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts" context="module">
	import type { MicroserviceType, Microservice } from '$lib/microservices';
</script>

<script lang="ts" generics="T extends MicroserviceType">
	import type { MicroserviceFolder } from '@api/download-microservices-[orgId]/shared-operations';

	import {
		CollectionManager,
		CreateRecord,
		DeleteRecord,
		EditRecord
	} from '$lib/collectionManager';
	import Icon from '$lib/components/icon.svelte';
	import PlainCard from '$lib/components/plainCard.svelte';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import { m } from '$lib/i18n';
	import { getRandomMicroservicePort } from '$lib/microservices';
	import MicroserviceBadge from '$lib/microservices/microserviceBadge.svelte';

	import { ProtectedOrgUI } from '$lib/organizations';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { Alert, Badge, Button } from 'flowbite-svelte';
	import { Clipboard, Pencil, Plus, Trash } from 'svelte-heros-v2';
	import CopyButton from '$lib/components/copyButton.svelte';
	import { pb } from '$lib/pocketbase';

	export let microserviceType: T;
	export let organizationId: string;

	const recordType = createTypeProp<Microservice>();

	const microservicesStrings: Record<
		MicroserviceType,
		{ name: { singular: string; plural: string }; description: string }
	> = {
		authorization_servers: {
			name: { singular: m.Authorization_server(), plural: m.Authorization_servers() },
			description: m.authorization_server_description()
		},
		issuers: {
			name: { singular: m.Credential_issuer(), plural: m.Credential_issuers() },
			description: m.credential_issuer_description()
		},
		relying_parties: {
			name: { singular: m.Relying_party(), plural: m.Relying_parties() },
			description: m.relying_party_description()
		}
	};

	$: strings = microservicesStrings[microserviceType];

	//

	function getMicroserviceUpdateString(microservice: Microservice) {
		const map: Record<MicroserviceType, MicroserviceFolder> = {
			authorization_servers: 'authz_server',
			issuers: 'credential_issuer',
			relying_parties: 'relying_party'
		};
		const urlWithoutProtocol = microservice.endpoint.replace(/(^\w+:|^)\/\//, '');
		const msFolder = map[microservice.collectionName as MicroserviceType];
		return `didroom_update ${urlWithoutProtocol}/${msFolder} ${pb.authStore.token}`;
	}
</script>

<CollectionManager
	{recordType}
	collection={microserviceType}
	initialQueryParams={{
		filter: `organization.id = '${organizationId}'`
	}}
	formSettings={{
		hide: { organization: organizationId },
		descriptions: {
			name: m.microservice_name_description(),
			endpoint: m.microservice_endpoint_description(),
			port: m.microservice_port_description()
		},
		defaults: {
			port: getRandomMicroservicePort()
		},
		placeholders: {
			endpoint: 'https://microservice.com/endpoint',
			name: 'My microservice'
		}
	}}
	let:records
>
	<SectionTitle tag="h5" title={strings.name.plural} description={strings.description}>
		<CreateRecord slot="right" modalTitle={`${m.Add_new()} – ${strings.name.singular}`}>
			<svelte:fragment slot="button" let:openModal>
				<Button on:click={openModal}>
					{m.Add_new()}
					<Icon src={Plus} ml></Icon>
				</Button>
			</svelte:fragment>
		</CreateRecord>
	</SectionTitle>

	<div class="space-y-4">
		{#each records as record}
			<PlainCard let:Title let:Description class="py-4">
				<div class="flex items-center gap-2">
					<Title>{record.name}</Title>
					<MicroserviceBadge type={microserviceType} />
				</div>
				<Description>
					<span class="font-bold">{m.Endpoint()}:</span>
					{record.endpoint}
				</Description>
				<Description>
					<span class="font-bold">{m.Port()}:</span>
					{record.port}
				</Description>

				<svelte:fragment slot="right">
					<ProtectedOrgUI orgId={organizationId} roles={['admin', 'owner']}>
						<div class="flex flex-col items-end gap-2">
							<div class="flex gap-2">
								<EditRecord
									{record}
									let:openModal
									modalTitle={`${m.Edit()} – ${strings.name.singular}`}
								>
									<svelte:fragment slot="beforeForm">
										<Alert color="yellow" border class="mb-8">
											<p class="font-bold">{m.Warning()}</p>
											<p>{m.microservice_edit_warning()}</p>
										</Alert>
									</svelte:fragment>

									<Button size="xs" outline on:click={openModal}>
										{m.Edit()}
										<Icon size={16} src={Pencil} ml></Icon>
									</Button>
								</EditRecord>

								<DeleteRecord
									{record}
									let:openModal
									modalTitle={`${m.Delete()} – ${strings.name.singular}`}
								>
									<Button size="xs" outline on:click={openModal}>
										<Icon size={16} src={Trash} />
									</Button>
								</DeleteRecord>
							</div>

							<CopyButton
								iconSize={16}
								textToCopy={getMicroserviceUpdateString(record)}
								buttonProps={{ color: 'primary', outline: true, size: 'xs' }}
							>
								{m.Copy_update_script()}
							</CopyButton>
						</div>
					</ProtectedOrgUI>
				</svelte:fragment>
			</PlainCard>
		{/each}
	</div>
</CollectionManager>
