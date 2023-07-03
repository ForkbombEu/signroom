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
	<TableHead>
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
			<TableBodyRow>
				{#if showCheckboxes}
					<TableBodyCell>
						<SelectionCheckbox {record} />
					</TableBodyCell>
				{/if}
				{#each fields as field}
					<TableBodyCell>
						{@const component = fieldsComponents[field]}
						<FieldComponent {record} {field} {component} />
					</TableBodyCell>
				{/each}
				{#if hasActions}
					<TableBodyCell>
						<div class="flex items-center space-x-2">
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
