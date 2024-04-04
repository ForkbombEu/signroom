<script lang="ts">
	import { Collections, type ServicesResponse } from '$lib/pocketbase/types';
	import { CollectionEmptyState, CollectionManager, CollectionTable } from '$lib/collectionManager';
	import { Eye, Plus } from 'svelte-heros-v2';
	import { Button, Heading, A } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import { createTypeProp } from '$lib/utils/typeProp';
	import IconButton from '$lib/components/iconButton.svelte';
	import { m } from '$lib/i18n';
	import OrganizationLayout from '$lib/components/organizationLayout.svelte';

	export let data;
	let { organization } = data;

	let createIssuanceHref = `${$page.url.pathname}/create`;

	const recordType = createTypeProp<ServicesResponse>();

	const serviceUrl = (id: string) => `${$page.url.pathname}/${id}`;
</script>

<OrganizationLayout org={data.organization}>
	<CollectionManager
		{recordType}
		collection={Collections.Services}
		let:records
		initialQueryParams={{
			filter: `organization.id = '${organization.id}'`
		}}
	>
		<div class="flex justify-between items-center mb-8">
			<Heading tag="h4">{m.Credential_issuances()}</Heading>
			{#if records.length > 0}
				<Button href={createIssuanceHref} color="alternative" class="shrink-0">
					<Plus size="20" />
					<span class="ml-1">{m.Create_a_new_credential_issuance()}</span>
				</Button>
			{/if}
		</div>

		<CollectionTable
			fields={['name', 'organization']}
			{records}
			hideActions={['edit', 'share', 'select']}
		>
			<svelte:fragment slot="emptyState">
				<CollectionEmptyState title={m.No_credential_issuances()} hideCreateButton>
					<svelte:fragment slot="bottom">
						<Button href={createIssuanceHref} color="alternative">
							<Plus size="20" />
							<span class="ml-1">{m.Create_a_new_credential_issuance()}</span>
						</Button>
					</svelte:fragment>
				</CollectionEmptyState>
			</svelte:fragment>

			<svelte:fragment slot="actions" let:record>
				<IconButton size="sm" icon={Eye} border href={serviceUrl(record.id)} />
			</svelte:fragment>
		</CollectionTable>
	</CollectionManager>
</OrganizationLayout>
