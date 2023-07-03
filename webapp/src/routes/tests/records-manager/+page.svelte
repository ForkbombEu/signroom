<script lang="ts">
	import { currentUser } from '$lib/pocketbase';
	import { Collections, type CrudExampleRecord } from '$lib/pocketbase-types';
	import RecordsManager, {
		createSlotTypeCaster
	} from '$lib/schema/recordsManager/recordsManager.svelte';
	import RecordsManagerTopbar from '$lib/schema/recordsManager/recordsManagerTopbar.svelte';
	import Chip from '$lib/schema/recordsManager/views/fieldsComponents/cells/chip.svelte';
	import RecordCard from '$lib/schema/recordsManager/views/recordCard.svelte';
	import RecordsTable from '$lib/schema/recordsManager/views/recordsTable.svelte';
	import { Heading, Hr } from 'flowbite-svelte';

	const slotTypeCaster = createSlotTypeCaster<CrudExampleRecord>();
</script>

<div class="p-4">
	<RecordsManager
		collection={Collections.CrudExample}
		formSettings={{
			hiddenFields: ['owner'],
			hiddenFieldsValues: { owner: $currentUser?.id }
		}}
		{slotTypeCaster}
		let:records
	>
		<div class="space-y-8">
			<RecordsManagerTopbar />

			<Hr />

			<div class="space-y-4">
				<Heading tag="h4">Table</Heading>
				<RecordsTable {records} fields={['id', 'text', 'textarea']} />
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
								fields={['text', 'select', 'textarea']}
								fieldsComponents={{ select: Chip }}
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
