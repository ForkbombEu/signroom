<script lang="ts">
	import { currentUser } from '$lib/pocketbase';
	import { Collections, type CrudExampleRecord } from '$lib/pocketbase-types';
	import FilterRecords from '$lib/schema/recordsManager/filterRecords.svelte';
	import RecordsManager, {
		createSlotTypeCaster
	} from '$lib/schema/recordsManager/recordsManager.svelte';
	import RecordsManagerTopbar from '$lib/schema/recordsManager/recordsManagerTopbar.svelte';
	import EmptyState from '$lib/schema/recordsManager/views/emptyState.svelte';
	import Chip from '$lib/schema/recordsManager/views/fieldsComponents/cells/chip.svelte';
	import RecordCard from '$lib/schema/recordsManager/views/recordCard.svelte';
	import RecordsTable from '$lib/schema/recordsManager/views/recordsTable.svelte';
	import { Heading, Hr } from 'flowbite-svelte';
	import { XCircle } from 'svelte-heros-v2';

	const slotTypeCaster = createSlotTypeCaster<CrudExampleRecord>();
</script>

<div class="p-4">
	<RecordsManager
		collection={Collections.CrudExample}
		formSettings={{
			hiddenFields: ['owner'],
			hiddenFieldsValues: { owner: $currentUser?.id }
		}}
		editFormSettings={{
			excludedFields: ['select', 'text']
		}}
		{slotTypeCaster}
		let:records
	>
		<div class="space-y-8">
			<RecordsManagerTopbar />

			<Hr />

			<div class="space-y-4">
				<Heading tag="h4">Table</Heading>
				<RecordsTable
					{records}
					fields={['id', 'text', 'textarea']}
					emptyState={{
						title: 'No records',
						description: 'There are no records to show.'
					}}
				/>
				<!-- add this component where you like, within recordsManager and indicate which fields to search for -->
				<FilterRecords searchableFields={['text', 'textarea']} />
				<RecordsTable {records} fields={['id', 'text', 'textarea']} />
			</div>

			<Hr />

			<div class="space-y-4">
				<Heading tag="h4">Cards</Heading>
				{#if records.length === 0}
					<EmptyState title={'No records'} description={'Start adding records.'} icon={XCircle}/>
				{:else}
					<div class="grid grid-cols-4 gap-4">
						{#each records as record}
							<RecordCard
								{record}
								titleField="id"
								fields={['text', 'select', 'textarea']}
								fieldsComponents={{ select: Chip }}
								showEdit
								showCheckbox
								showDelete
							/>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</RecordsManager>
</div>
