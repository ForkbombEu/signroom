<script lang="ts">
	import type { PBRecord, PBResponse, PBResponseKeys } from '$lib/utils/types';
	import { getRecordsManagerContext } from '../collectionManager.svelte';

	import { ShareRecord, SelectRecord, EditRecord, DeleteRecord } from './recordActions';
	import FieldComponent, {
		type FieldsComponents
	} from './fieldComponents/fieldComponentRenderer.svelte';

	import { Card, P } from 'flowbite-svelte';

	//

	type RecordGeneric = $$Generic<PBRecord>;
	export let record: PBResponse<RecordGeneric>;

	export let fields: PBResponseKeys<PBResponse<RecordGeneric>>[] = [];
	export let titleField = '';

	export let fieldsComponents: FieldsComponents<RecordGeneric> = {};

	export let showDelete = false;
	export let showEdit = false;
	export let showShare = false;
	export let showCheckbox = false;

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

	{#if showCheckbox}
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
		{#if showEdit}
			<EditRecord {record} />
		{/if}
		{#if showDelete}
			<DeleteRecord {record} />
		{/if}
		{#if showShare}
			<ShareRecord {record} />
		{/if}
	</div>
</Card>