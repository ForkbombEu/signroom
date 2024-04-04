<script lang="ts">
	import {
		CollectionManager,
		CollectionManagerHeader,
		CollectionTable
	} from '$lib/collectionManager';
	import { Collections, type IssuersResponse } from '$lib/pocketbase/types';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { Heading } from 'flowbite-svelte';
	import { m } from '$lib/i18n';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import CreateRecord from '$lib/collectionManager/ui/recordActions/createRecord.svelte';
	import OrganizationLayout from '$lib/components/organizationLayout.svelte';

	export let data;
	const recordType = createTypeProp<IssuersResponse>();
</script>

<OrganizationLayout org={data.organization}>
	<div class="space-y-10">
		<CollectionManager
			{recordType}
			collection={Collections.Issuers}
			formSettings={{
				hide: { organization: data.organization.id }
			}}
			let:records
		>
			<div class="space-y-8">
				<SectionTitle
					title={m.Credential_issuers()}
					description={m.credential_issuer_description()}
				>
					<CreateRecord slot="right">{m.Add_new()}</CreateRecord>
				</SectionTitle>
				<CollectionTable
					{records}
					fields={['name', 'endpoint']}
					hideActions={['share', 'delete', 'select']}
				/>
			</div>
		</CollectionManager>

		<CollectionManager
			{recordType}
			collection={Collections.AuthorizationServers}
			formSettings={{
				hide: { organization: data.organization.id }
			}}
			let:records
		>
			<div class="space-y-8">
				<SectionTitle
					title={m.Authorization_servers()}
					description={m.authorization_server_description()}
				>
					<CreateRecord slot="right">{m.Add_new()}</CreateRecord>
				</SectionTitle>
				<CollectionTable
					{records}
					fields={['name', 'endpoint']}
					hideActions={['share', 'delete', 'select']}
				/>
			</div>
		</CollectionManager>

		<CollectionManager
			{recordType}
			collection={Collections.RelyingParties}
			formSettings={{
				hide: { organization: data.organization.id }
			}}
			let:records
		>
			<div class="space-y-8">
				<SectionTitle title={m.Relying_parties()} description={m.relying_party_description()}>
					<CreateRecord slot="right">{m.Add_new()}</CreateRecord>
				</SectionTitle>
				<CollectionTable
					{records}
					fields={['name', 'endpoint']}
					hideActions={['share', 'delete', 'select']}
				/>
			</div>
		</CollectionManager>
	</div>
</OrganizationLayout>
