<script lang="ts">
	import {
		CollectionManager,
		CollectionManagerHeader,
		CollectionTable
	} from '$lib/collectionManager';
	import { Collections, type IssuersResponse } from '$lib/pocketbase/types';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { Heading } from 'flowbite-svelte';

	export let data;
	const recordType = createTypeProp<IssuersResponse>();
</script>

<CollectionManager
	{recordType}
	collection={Collections.Issuers}
	formSettings={{
		hide: { organization: data.organization.id }
	}}
	let:records
>
	<CollectionManagerHeader>
		<Heading slot="title" tag="h4">Credential issuers</Heading>
	</CollectionManagerHeader>
	<CollectionTable
		{records}
		fields={['name', 'endpoint']}
		hideActions={['share', 'delete', 'select']}
	/>
</CollectionManager>
