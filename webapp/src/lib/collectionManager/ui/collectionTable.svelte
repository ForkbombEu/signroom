<script lang="ts">
	import type { FieldsComponents, Keys, ViewAction } from './types';
	import type { PBRecord, PBResponse, PBExpand } from '$lib/utils/types';

	import { ShareRecord, SelectRecord, EditRecord, DeleteRecord } from './recordActions';
	import EmptyState from './collectionEmptyState.svelte';
	import FieldComponent from './fieldComponents/fieldComponentRenderer.svelte';
	import { getRecordsManagerContext } from '../collectionManager.svelte';

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
	import RecordsTableHead from './collectionTableHeader.svelte';

	//

	type RecordGeneric = $$Generic<PBRecord>;
	type ExpandGeneric = $$Generic<PBExpand>;
	export let records: PBResponse<RecordGeneric, ExpandGeneric>[] = [];

	export let fields: (Keys<RecordGeneric> | `_${string}`)[] = [];
	export let fieldsComponents: FieldsComponents<RecordGeneric> = {};
	export let fieldsLabels: Partial<Record<(typeof fields)[number], string>> = {};
	export let hideActions: Array<ViewAction> = [];

	const { selectionManager } = getRecordsManagerContext();
	const { allRecordsSelected, toggleSelectAllRecords, selectedRecords } = selectionManager;

	$: selectAll = allRecordsSelected($selectedRecords);

	$: hasNoActionColumn =
		hideActions.includes('delete') &&
		hideActions.includes('edit') &&
		hideActions.includes('share') &&
		!$$slots.actions;
</script>

{#if records.length === 0}
	<slot name="emptyState">
		<EmptyState />
	</slot>
{:else}
	<Table>
		<TableHead>
			{#if !hideActions.includes('select')}
				<TableHeadCell>
					<Checkbox checked={selectAll} on:click={toggleSelectAllRecords} />
				</TableHeadCell>
			{/if}
			{#each fields as field}
				{@const label = fieldsLabels[field] ?? field}
				<RecordsTableHead field={label} />
			{/each}
			{#if $$slots.default}
				<TableHeadCell />
			{/if}
			{#if !hasNoActionColumn}
				<TableHeadCell>Actions</TableHeadCell>
			{/if}
		</TableHead>
		<TableBody>
			{#each records as record (record.id)}
				<TableBodyRow>
					{#if !hideActions.includes('select')}
						<TableBodyCell>
							<SelectRecord {record} />
						</TableBodyCell>
					{/if}
					{#each fields as field}
						<TableBodyCell>
							{@const component = fieldsComponents[field]}
							<FieldComponent {record} {field} {component} />
						</TableBodyCell>
					{/each}
					{#if $$slots.default}
						<TableBodyCell>
							<slot {record} />
						</TableBodyCell>
					{/if}
					{#if !hasNoActionColumn}
						<TableBodyCell>
							<div class="flex items-center space-x-2">
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
						</TableBodyCell>
					{/if}
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
{/if}
