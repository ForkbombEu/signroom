<script lang="ts" context="module">
	const toasts = {
		add: '✅ Signature shared successfully',
		remove: '✅ Signature unshared successfully',
		signed: '✅ Document signed successfully'
	};
	export type ToastContent = keyof typeof toasts;
</script>

<script lang="ts">
	import { Collections } from '$lib/pocketbase/types';
	import { CollectionManager, CollectionManagerHeader, CollectionTable } from '$lib/collectionManager';
</script>

<CollectionManager collection={Collections.Issuers} let:records>
	<CollectionManagerHeader />
	<CollectionTable {records} fields={["name"]}></CollectionTable>
</CollectionManager>
