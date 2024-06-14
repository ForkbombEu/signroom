<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { getRecordsManagerContext } from '../../collectionManager.svelte';
	import type { PBResponse } from '$lib/utils/types';

	import { RecordForm } from '$lib/recordForm';
	import { Button, Modal } from 'flowbite-svelte';
	import PortalWrapper from '$lib/components/portalWrapper.svelte';
	import { Plus } from 'svelte-heros-v2';

	//

	type RecordGeneric = $$Generic<PBResponse>;
	export let recordType = createTypeProp<RecordGeneric>();
	recordType;

	export let initialData: Partial<RecordGeneric> = {};
	export let modalTitle = 'Create record';

	//

	const dispatch = createEventDispatcher<{
		success: {
			record: RecordGeneric;
		};
	}>();

	let { collection, dataManager, formFieldsSettings } = getRecordsManagerContext<RecordGeneric>();
	let { base, create } = formFieldsSettings;
	let fieldsSettings = { ...base, ...create };
	let { loadRecords } = dataManager;

	//

	let open = false;

	function openModal() {
		open = true;
	}
</script>

<slot name="button" {openModal}>
	<Button class="shrink-0" color="alternative" on:click={openModal}>
		<Plus size="20" />
		<span class="ml-1">
			<slot>Add entry</slot>
		</span>
	</Button>
</slot>

<PortalWrapper>
	<Modal bind:open title={modalTitle} size="md" placement="center">
		<div class="w-full">
			<RecordForm
				{collection}
				{fieldsSettings}
				{initialData}
				on:success={async (e) => {
					await loadRecords();
					dispatch('success', { record: e.detail.record });
					open = false;
				}}
			/>
		</div>
	</Modal>
</PortalWrapper>
