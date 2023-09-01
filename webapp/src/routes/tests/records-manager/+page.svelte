<script lang="ts">
	import GridSpinner from '$lib/components/gridSpinner.svelte';
	import TableSkeleton from '$lib/components/tableSkeleton.svelte';
	import { currentUser } from '$lib/pocketbase';
	import { Collections, type CrudExampleRecord } from '$lib/pocketbase-types';
	import FilterRecords from '$lib/schema/recordsManager/filterRecords.svelte';
	import RecordsManager from '$lib/schema/recordsManager/recordsManager.svelte';
	import RecordsManagerTopbar from '$lib/schema/recordsManager/recordsManagerTopbar.svelte';
	import EmptyState from '$lib/schema/recordsManager/views/emptyState.svelte';
	import Chip from '$lib/schema/recordsManager/views/fieldsComponents/cells/chip.svelte';
	import RecordCard from '$lib/schema/recordsManager/views/recordCard.svelte';
	import RecordsTable from '$lib/schema/recordsManager/views/recordsTable.svelte';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { CardPlaceholder, Heading, Hr, Skeleton } from 'flowbite-svelte';
	import { XCircle } from 'svelte-heros-v2';

	const recordType = createTypeProp<CrudExampleRecord>();
</script>

<div class="p-4">
	<RecordsManager
		{recordType}
		collection={Collections.CrudExample}
		formSettings={{
			hide: { owner: $currentUser?.id }
		}}
		editFormSettings={{
			exclude: ['select', 'text']
		}}
		let:records
		let:loadRecords
	>
		<div class="space-y-8">
			<RecordsManagerTopbar />

			<Hr />

			<div class="space-y-4">
				<Heading tag="h4">Table</Heading>
				{#await loadRecords()}
					<TableSkeleton columns={['checkbox', 'image', 'short text', 'long text', 'actions']} />
				{:then}
					{#if records.length === 0}
						<EmptyState title={'No records'} description={'Start adding records.'} icon={XCircle} />
					{:else}
						<RecordsTable
							{records}
							fields={['id', 'text', 'textarea']}
							emptyState={{
							title: 'No records',
							description: 'There are no records to show.'
							}}
						/>
						<FilterRecords {recordType} searchableFields={['text', 'textarea']} />
					{/if}
				{:catch}
					<EmptyState title={'Error'} description={'Something went wrong.'} icon={XCircle} />
				{/await}
			</div>

			<Hr />

			<div class="space-y-4">
				<Heading tag="h4">Cards</Heading>
				{#if records.length === 0}
					<EmptyState title={'No records'} description={'Start adding records.'} icon={XCircle} />
				{:else}
				{#await loadRecords()}
					<div class="grid grid-cols-4 gap-4">
						{#each Array(4) as _}
							<CardPlaceholder />
						{/each}
					</div>
				{:then}
					{#if records.length === 0}
						<EmptyState title={'No records'} description={'Start adding records.'} icon={XCircle} />
					{:else}
						<div class="grid grid-cols-4 gap-4">
							{#each records as record}
								<RecordCard
									{record}
									titleField="id"
									fieldsComponents={{ "select": Chip }}
									showEdit
									showCheckbox
									showDelete
								/>
							{/each}
						</div>
					{/if}
				{:catch}
					<EmptyState title={'Error'} description={'Something went wrong.'} icon={XCircle} />
				{/await}
				{/if}
			</div>
		</div>
	</RecordsManager>
</div>
