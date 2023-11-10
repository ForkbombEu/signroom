<script lang="ts">
	import type { FieldsComponents, Keys, ViewAction } from './types';
	import type { PBRecord, PBResponse } from '$lib/utils/types';
	import { getRecordsManagerContext } from '../collectionManager.svelte';

	import { ShareRecord, SelectRecord, EditRecord, DeleteRecord } from './recordActions';
	import FieldComponent from './fieldComponents/fieldComponentRenderer.svelte';

	import { Card, P } from 'flowbite-svelte';

	//

	type RecordGeneric = $$Generic<PBRecord>;
	export let record: PBResponse<RecordGeneric>;

	export let fields: Keys<RecordGeneric>[] = [];
	export let fieldsComponents: FieldsComponents<RecordGeneric> = {};
	export let hideActions: Array<ViewAction> = [];
	export let titleField = '';

	//

	const { selectionManager } = getRecordsManagerContext();
	const { selectedRecords } = selectionManager;

	$: isSelected = $selectedRecords.includes(record.id);
	const outline = '!outline !outline-2 !outline-primary-600';
</script>

<Card class={`!relative !p-4 !max-w-none ${isSelected ? outline : ''}`}>
	{#if titleField}
		<P weight="bold" class="mb-2">{record[titleField]}</P>
	{/if}

	{#if !hideActions.includes('select')}
		<div class="absolute right-1 top-1 p-3 bg-inherit">
			<SelectRecord {record} />
		</div>
	{/if}

	{#if fields.length}
		<div class="space-y-2">
			{#each fields as field}
				{@const component = fieldsComponents[field]}
				<div>
					<FieldComponent {record} {field} {component} />
				</div>
			{/each}
		</div>
	{/if}

	<slot {record} />

	<div class="flex justify-end items-center gap-1 pt-2">
		<slot name="actions" {record} />
		{#if !hideActions.includes('edit')}
			<EditRecord {record} />
		{/if}
		{#if !hideActions.includes('share')}
			<ShareRecord {record} />
		{/if}
		{#if !hideActions.includes('delete')}
			<DeleteRecord {record} />
		{/if}
	</div>
</Card>