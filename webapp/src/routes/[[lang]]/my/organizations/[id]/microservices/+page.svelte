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

	export let data;
	const recordType = createTypeProp<IssuersResponse>();
</script>

<div class="space-y-10">
	<CollectionManager
		{recordType}
		collection={Collections.Issuers}
		formSettings={{
			hide: { organization: data.organization.id }
		}}
		let:records
	>
		<div>
			<CollectionManagerHeader>
				<Heading slot="title" tag="h4">{m.Credential_issuers()}</Heading>
			</CollectionManagerHeader>
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
		<div>
			<CollectionManagerHeader>
				<Heading slot="title" tag="h4">{m.Authorization_servers()}</Heading>
			</CollectionManagerHeader>
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
		<div>
			<CollectionManagerHeader>
				<Heading slot="title" tag="h4">{m.Relying_parties()}</Heading>
			</CollectionManagerHeader>
			<CollectionTable
				{records}
				fields={['name', 'endpoint']}
				hideActions={['share', 'delete', 'select']}
			/>
		</div>
	</CollectionManager>
</div>
