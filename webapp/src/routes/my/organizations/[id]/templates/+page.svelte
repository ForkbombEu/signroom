<script lang="ts">
	import { CollectionManager } from '$lib/collectionManager';
	import CollectionManagerHeader from '$lib/collectionManager/ui/collectionManagerHeader.svelte';
	import CollectionTable from '$lib/collectionManager/ui/collectionTable.svelte';
	import { Collections, type TemplatesRecord } from '$lib/pocketbase/types';
	import { createTypeProp } from '$lib/utils/typeProp';

	const recordType = createTypeProp<TemplatesRecord>();
</script>

<CollectionManager
	{recordType}
	collection={Collections.Templates}
	initialQueryParams={{ expand: 'services(template)' }}
	let:records
>
	<CollectionManagerHeader></CollectionManagerHeader>
	<CollectionTable {records} fields={['name', 'ciao']} hideActions={['share', 'delete']} />
</CollectionManager>
