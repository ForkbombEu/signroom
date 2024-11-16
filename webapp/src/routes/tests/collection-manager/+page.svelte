<script lang="ts">
	import { CollectionManager } from '@/collections-components/manager';
</script>

<CollectionManager
	collection="z_test_collection"
	queryOptions={{
		expand: ['relation_field'],
		perPage: 6
	}}
>
	<svelte:fragment slot="top" let:Search let:Header>
		<Header />

		<div class="mb-4 mt-4">
			<Search />
		</div>
	</svelte:fragment>

	<svelte:fragment slot="records" let:records let:Table let:Card>
		<Table {records} fields={['id', 'text_field', 'relation_field', 'created']}></Table>

		<div class="mt-4 space-y-2">
			{#each records as record}
				<Card {record} let:Title let:Description>
					<Title>{record.text_field}</Title>
					<Description>{record.expand?.relation_field?.email}</Description>
				</Card>
			{/each}
		</div>
	</svelte:fragment>
</CollectionManager>