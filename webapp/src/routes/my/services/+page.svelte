<script lang="ts">
	import { Collections } from '$lib/pocketbase/types';
	import { CollectionManager, CollectionTable } from '$lib/collectionManager';


</script>

<div class="p-4">
	<CollectionManager collection={Collections.Services} let:records>
		<CollectionTable {records} let:record></CollectionTable>
	</CollectionManager>
</div>
