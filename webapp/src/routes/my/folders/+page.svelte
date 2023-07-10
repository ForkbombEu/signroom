<script lang="ts">
	import { currentUser } from '$lib/pocketbase';
	import { Collections, type CrudExampleRecord } from '$lib/pocketbase-types';
	import RecordsManager, {
		createSlotTypeCaster
	} from '$lib/schema/recordsManager/recordsManager.svelte';
	import RecordsManagerTopbar from '$lib/schema/recordsManager/recordsManagerTopbar.svelte';
	import RecordCard from '$lib/schema/recordsManager/views/recordCard.svelte';
	import { Heading } from 'flowbite-svelte';
	import Chip from '$lib/schema/recordsManager/views/fieldsComponents/cells/chip.svelte';

	const slotTypeCaster = createSlotTypeCaster<CrudExampleRecord>();
</script>

<div class="p-4">
	<RecordsManager
		collection={Collections.Folders}
		formSettings={{
			hiddenFields: ['owner'],
			hiddenFieldsValues: { owner: $currentUser?.id }
		}}
		{slotTypeCaster}
		let:records
	>
		<RecordsManagerTopbar>
			<svelte:fragment slot="title">
				<Heading tag="h4">My folders</Heading>
			</svelte:fragment>
		</RecordsManagerTopbar>
		<div class="space-y-4">
			<div class="gap-4 grid grid-cols-2">
				{#each records as record}
					<div class="grow">
						<RecordCard
							{record}
							titleField="name"
							fields={['name']}
							showEdit
							showCheckbox
							showDelete
						/>
					</div>
				{/each}
			</div>
		</div>
	</RecordsManager>
</div>
