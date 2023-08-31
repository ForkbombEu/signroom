<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { getRecordsManagerContext } from '../recordsManager.svelte';
	import type { PBRecord, PBResponse } from '$lib/utils/types';

	import CrudForm from '$lib/schema/CRUDForm.svelte';
	import { Button, Modal } from 'flowbite-svelte';
	import ModalWrapper from '$lib/components/modalWrapper.svelte';
	import { Plus } from 'svelte-heros-v2';

	//

	type RecordGeneric = $$Generic<PBRecord>;
	export let recordType = createTypeProp<RecordGeneric>();
	recordType;

	export let initialData: Partial<RecordGeneric> = {};

	//

	const dispatch = createEventDispatcher<{
		success: {
			record: PBResponse<RecordGeneric>;
		};
	}>();

	const { collection, dataManager, formFieldsSettings } = getRecordsManagerContext<RecordGeneric>();
	const { base, create } = formFieldsSettings;
	const fieldsSettings = { ...base, ...create };
	const { loadRecords } = dataManager;

	//

	let open = false;

	function openModal() {
		open = true;
	}
</script>

<slot {openModal}>
	<Button color="alternative" on:click={openModal}>
		<Plus size="20" />
		<span class="ml-1">Add entry</span>
	</Button>
</slot>

<ModalWrapper>
	<Modal bind:open title="Create record" size="lg">
		<div class="w-[500px]">
			<CrudForm
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
</ModalWrapper>
