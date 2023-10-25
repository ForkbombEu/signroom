<script>
	import CollectionManager from '$lib/collectionManager/collectionManager.svelte';
	import CollectionTable from '$lib/collectionManager/ui/collectionTable.svelte';
	import { Collections } from '$lib/pocketbase/types';

	export let data;
	$: organization = data.organization;
</script>

<CollectionManager
	collection={Collections.OrgJoinRequests}
	initialQueryParams={{
		filter: `organization.id = "${organization.id}"`
	}}
	let:records
>
	<CollectionTable {records}></CollectionTable>
</CollectionManager>
