<script lang="ts">
	import { CollectionSelect } from '@/collections-components';
	import CollectionSearch from '@/collections-components/collectionSearch.svelte';
</script>

<div class="space-y-4">
	<CollectionSearch
		collection="z_test_collection"
		queryOptions={{ expand: ['relation_multi_field'] }}
		displayFn={(record) => record.expand?.relation_multi_field?.map((u) => u.name).join(', ') ?? ''}
	/>

	<CollectionSelect
		collection="z_test_collection"
		onSelect={(r) => console.log(r)}
		queryOptions={{ expand: ['relation_multi_field'] }}
		displayFn={(record) => {
			return record.expand?.relation_multi_field?.map((u) => u.name).join(', ') ?? '';
		}}
	/>
</div>
