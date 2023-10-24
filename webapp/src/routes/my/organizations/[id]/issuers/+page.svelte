<script lang="ts">
	import {
		CollectionManager,
		CollectionManagerHeader,
		CollectionTable
	} from '$lib/collectionManager';
	import { Collections, type ServicesRecord } from '$lib/pocketbase/types';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { Heading } from 'flowbite-svelte';

	export let data;
	let { organization } = data;
	console.log(organization);

	const recordType = createTypeProp<ServicesRecord>();
</script>

<CollectionManager {recordType} collection={Collections.Issuers} let:records>
	<CollectionManagerHeader>
		<Heading slot="title" tag="h4">Credential issuers</Heading>
	</CollectionManagerHeader>
	<CollectionTable {records} fields={['name']} hideActions={['share', 'delete', 'select']} />
</CollectionManager>
