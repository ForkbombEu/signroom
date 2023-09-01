<script lang="ts">
	import { currentUser } from '$lib/pocketbase';
	import { Collections, type CrudExampleRecord } from '$lib/pocketbase-types';
	import RecordsManager from '$lib/schema/recordsManager/recordsManager.svelte';
	import RecordsManagerTopbar from '$lib/schema/recordsManager/recordsManagerTopbar.svelte';
	import Chip from '$lib/schema/recordsManager/views/fieldsComponents/cells/chip.svelte';
	import RecordCard from '$lib/schema/recordsManager/views/recordCard.svelte';
	import RecordsTable from '$lib/schema/recordsManager/views/recordsTable.svelte';
	import { Button, Heading, Hr } from 'flowbite-svelte';
	import { Share } from 'svelte-heros-v2';
	import type { Record } from 'pocketbase';
	import ShareRecord from '$lib/schema/recordsManager/recordActions/shareRecord.svelte';
	import { createTypeProp } from '$lib/utils/typeProp';

	let shareModal = false;
	let record: Record;
	let openShareModal = (r: Record) => {
		console.log('openShareModal', r);

		shareModal = true;
		record = r;
	};
	$: {
		console.log(record);
	}

	const slotTypeCaster = createTypeProp<CrudExampleRecord>();
</script>

<div class="p-4">
	<RecordsManager
		collection={Collections.Posts}
		
		editFormSettings={{
			exclude: ['owner'],
		}}
		let:records
	>
		<div class="space-y-8">

			<Hr />

			<div class="space-y-4">
				<Heading tag="h4">Table</Heading>
				<!-- add this component where you like, within recordsManager and indicate which fields to search for -->
				<RecordsTable
					{records}
					fields={['id', 'text', 'title', 'author']}
					showShare
				/>
			</div>

			<Hr />

			<div class="space-y-4">
				<Heading tag="h4">Cards</Heading>
				<div class="flex gap-4">
					{#each records as record}
						<div class="grow">
							<RecordCard
								{record}
								titleField="id"
								fields={['text', 'title']}
								showEdit
								showCheckbox
								showDelete
							/>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</RecordsManager>
</div>
