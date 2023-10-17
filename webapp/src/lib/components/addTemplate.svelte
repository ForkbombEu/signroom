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
	import { CollectionManager, CollectionTable, EditRecord } from '$lib/collectionManager';
</script>

<CollectionManager collection={Collections.Templates} let:records>
	<CollectionTable {records}></CollectionTable>
</CollectionManager>
