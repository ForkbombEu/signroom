<script lang="ts">
	import { Collections } from '$lib/pocketbase/types';
	import { CollectionManager, CollectionManagerHeader, CollectionTable } from '$lib/collectionManager';
</script>

<CollectionManager collection={Collections.Issuers} let:records>
	<CollectionManagerHeader />
	<CollectionTable {records} fields={["name"]}></CollectionTable>
</CollectionManager>
