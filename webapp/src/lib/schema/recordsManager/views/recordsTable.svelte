<script lang="ts">
	import ShareRecord from '../recordActions/shareRecord.svelte';
	import { Clock } from 'svelte-heros-v2';
	import EmptyState from './emptyState.svelte';
	import FieldComponent, { type FieldsComponents } from './fieldComponent.svelte';
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
	import type { SvelteComponent } from 'svelte';
	import RecordsTableHead from './recordsTableHead.svelte';
	import SelectionCheckbox from '../recordActions/selectRecord.svelte';
	import EditRecord from '../recordActions/editRecord.svelte';
	import DeleteRecord from '../recordActions/deleteRecord.svelte';
	import type { PBRecord, PBResponse, PBResponseKeys } from '$lib/utils/types';

	//

	type RecordGeneric = $$Generic<PBRecord>;

	export let records: PBResponse<RecordGeneric>[] = [];
	export let fields: PBResponseKeys<PBResponse<RecordGeneric>>[] = ['id'];
	export let fieldsComponents: FieldsComponents<RecordGeneric> = {};
	export let showShare: boolean = false;

	export let showDelete = true;
	export let showEdit = true;
	export let showCheckboxes = true;
	export let emptyState: { title?: string; description?: string; icon?: typeof SvelteComponent } =
		{};
	const {
		title = 'No records',
		description = 'There are no records to show.',
		icon = Clock
	} = emptyState;

	const { selectionManager } = getRecordsManagerContext();
	const { allRecordsSelected, toggleSelectAllRecords, selectedRecords } = selectionManager;

	$: selectAll = allRecordsSelected($selectedRecords);
	$: hasActions = showEdit || showDelete || Boolean($$slots.default);
</script>

{#if records.length === 0}
	<slot name="empty_state">
		<EmptyState {title} {description} {icon} />
	</slot>
{:else}
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
								{#if showShare}
									<ShareRecord {record} />
								{/if}
								<slot {record} />
							</div>
						</TableBodyCell>
					{/if}
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
{/if}
