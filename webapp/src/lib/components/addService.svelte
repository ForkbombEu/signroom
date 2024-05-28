<script lang="ts">
	import { Collections } from '$lib/pocketbase/types';
	import {
		CollectionManager,
		CollectionManagerHeader,
		CollectionTable,
		EditRecord
	} from '$lib/collectionManager';
</script>

<CollectionManager collection={Collections.Services} let:records>
	<CollectionManagerHeader />
	<CollectionTable {records}></CollectionTable>
</CollectionManager>
