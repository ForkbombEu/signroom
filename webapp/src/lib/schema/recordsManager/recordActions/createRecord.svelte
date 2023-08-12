<script lang="ts">
	import CrudForm, { formMode } from '$lib/schema/CRUDForm.svelte';
	import { Button, Modal } from 'flowbite-svelte';
	import { Plus } from 'svelte-heros-v2';
	import { getRecordsManagerContext } from '../recordsManager.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { Record } from 'pocketbase';

	export let initialData: Record = {} as Record;

	const { collection, dataManager, formSettings } = getRecordsManagerContext();
	const { loadRecords } = dataManager;

	const dispatch = createEventDispatcher<{
		success: {
			record: Record;
		};
	}>();

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

<div class="fixed z-50">
	<Modal bind:open title="Create record" size="lg">
		<div class="md:w-[500px]">
			<CrudForm
				mode={formMode.CREATE}
				{collection}
				{formSettings}
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
