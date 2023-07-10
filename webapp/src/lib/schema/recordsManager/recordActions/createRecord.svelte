<script lang="ts">
	import CrudForm, { formMode } from '$lib/schema/CRUDForm.svelte';
	import { Button, Modal } from 'flowbite-svelte';
	import { Plus } from 'svelte-heros-v2';
	import { getRecordsManagerContext } from '../recordsManager.svelte';
	import { createEventDispatcher } from 'svelte';

	export let initialData: Record<string, unknown> = {};

	const { collection, dataManager, formSettings } = getRecordsManagerContext();
	const { loadRecords } = dataManager;

	const dispatch = createEventDispatcher<{ success: {
		record: Record<string, unknown>;
	} }>();

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

<div class="m-0">
	<Modal bind:open title="Create record" size="lg">
		<div class="w-[500px]">
			<CrudForm
				mode={formMode.CREATE}
				{collection}
				{formSettings}
				{initialData}
				on:success={async (e) => {
					await loadRecords();
					dispatch('success', {record:e.detail.record});
					open = false;
				}}
			/>
		</div>
	</Modal>
</div>
