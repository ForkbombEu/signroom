<script lang="ts" generics="C extends CollectionName">
	import { cn } from '@/components/utils';
	import type { CollectionResponses } from '@/pocketbase/types';
	import type { CollectionName } from '@/pocketbase/collections-models/types';
	import ItemCard from '@/components/custom/itemCard.svelte';
	import { getCollectionManagerContext } from '../collectionManagerContext';
	import {
		RecordShare,
		RecordSelect,
		RecordEdit,
		RecordDelete,
		type ItemAction
	} from '../record-actions';

	//

	export let record: CollectionResponses[C];
	export let hide: Array<ItemAction> = [];

	let className = '';
	export { className as class };

	//

	const { selectionContext: selection } = getCollectionManagerContext();
	const { selectedRecords } = selection;

	$: classes = cn(className, {
		'border-primary': $selectedRecords.includes(record.id)
	});
</script>

<ItemCard class="{classes} " let:Title let:Description>
	<svelte:fragment slot="left">
		{#if !hide.includes('select')}
			<RecordSelect {record} />
		{/if}
	</svelte:fragment>

	<slot {Title} {Description} />

	<svelte:fragment slot="right">
		<slot name="right" {record} />
		{#if !hide.includes('edit')}
			<RecordEdit {record} />
		{/if}
		{#if !hide.includes('share')}
			<RecordShare {record} />
		{/if}
		{#if !hide.includes('delete')}
			<RecordDelete {record} />
		{/if}
	</svelte:fragment>
</ItemCard>
