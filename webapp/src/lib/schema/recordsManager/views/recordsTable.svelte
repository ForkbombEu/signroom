<script lang="ts">
	import FieldComponent, { type FieldsComponents } from './fieldComponent.svelte';
	import type { Record as PBRecord } from 'pocketbase';
	import { getRecordsManagerContext } from '../recordsManager.svelte';

	// Components
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Checkbox
	} from 'flowbite-svelte';
	import RecordsTableHead from './recordsTableHead.svelte';
	import SelectionCheckbox from '../recordActions/selectRecord.svelte';
	import EditRecord from '../recordActions/editRecord.svelte';
	import DeleteRecord from '../recordActions/deleteRecord.svelte';

	//

	type RecordGeneric = $$Generic;

	export let records: (PBRecord & RecordGeneric)[] = [];
	export let fields: string[] = ['id'];
	export let fieldsComponents: FieldsComponents<RecordGeneric> = {};

	export let showDelete = true;
	export let showEdit = true;
	export let showCheckboxes = true;

	const { selectionManager } = getRecordsManagerContext();
	const { allRecordsSelected, toggleSelectAllRecords, selectedRecords } = selectionManager;

	$: selectAll = allRecordsSelected($selectedRecords);
	$: hasActions = showEdit || showDelete || Boolean($$slots.default);
</script>

<Table>
	<TableHead class="hidden md:table-header-group">
		{#if showCheckboxes}
			<TableHeadCell>
				<Checkbox checked={selectAll} on:click={toggleSelectAllRecords} />
			</TableHeadCell>
		{/if}
		{#each fields as field}
			<RecordsTableHead {field} />
		{/each}
		{#if hasActions}
			<TableHeadCell>Actions</TableHeadCell>
		{/if}
	</TableHead>
	<TableBody>
		{#each records as record (record.id)}
			<TableBodyRow class="flex flex-col md:table-row border-2 md:border-none rounded-lg mb-2">
				{#if showCheckboxes}
					<TableBodyCell>
						<SelectionCheckbox {record} />
					</TableBodyCell>
				{/if}
				{#each fields as field}
					<TableBodyCell tdClass="grid grid-cols-4 gap-2 md:table-cell">
						{@const component = fieldsComponents[field]}
						<div
							class="col-span-1 bg-primary-600 text-white font-semibold items-center flex p-2 rounded-l-lg md:hidden"
						>
							{field}
						</div>
						<div class="p-2 col-span-3">
							<FieldComponent {record} {field} {component} />
						</div>
					</TableBodyCell>
				{/each}
				{#if hasActions}
					<TableBodyCell tdClass="grid grid-cols-4 gap-2 md:table-cell">
						<div
							class="col-span-1 bg-primary-600 text-white font-semibold items-center flex p-2 rounded-l-lg md:hidden"
						>
							Actions
						</div>
						<div class="flex items-center md:space-x-2 p-2 col-span-3 justify-between">
							{#if showEdit}
								<EditRecord {record} />
							{/if}
							{#if showDelete}
								<DeleteRecord {record} />
							{/if}
							<slot {record} />
						</div>
					</TableBodyCell>
				{/if}
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
