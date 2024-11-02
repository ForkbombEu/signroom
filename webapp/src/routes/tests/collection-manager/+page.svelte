<script lang="ts">
	import { CollectionManager, RecordCreate, RecordCard } from '@/collections-components/manager';
</script>

<CollectionManager
	collection="z_test_collection"
	queryOptions={{
		expand: ['relation_field'],
		perPage: 6
	}}
	let:records
>
	<svelte:fragment slot="top">
		<div class="mb-4 flex justify-end gap-2">
			<RecordCreate />
		</div>
	</svelte:fragment>

	<div class="space-y-2">
		{#each records as record}
			<RecordCard {record} let:Title let:Description>
				<Title>{record.text_field}</Title>
				<Description>{record.expand?.relation_field?.email}</Description>
			</RecordCard>
		{/each}
	</div>
</CollectionManager>
