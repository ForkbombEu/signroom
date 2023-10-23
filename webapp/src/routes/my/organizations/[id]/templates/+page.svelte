<script lang="ts">
	import {
		CollectionManager,
		CollectionManagerHeader,
		CollectionTable
	} from '$lib/collectionManager';
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
	<CollectionTable {records} fields={['name']} hideActions={['share', 'delete']} />
</CollectionManager>
