<script lang="ts">
	import type { Record } from 'pocketbase';
	import { Button, Modal } from 'flowbite-svelte';
	import { Pencil } from 'svelte-heros-v2';
	import CrudForm, { formMode } from '$lib/schema/CRUDForm.svelte';
	import { getRecordsManagerContext } from '../recordsManager.svelte';

	type RecordGeneric = $$Generic;

	export let record: RecordGeneric & Record;

	const { dataManager, formSettings } = getRecordsManagerContext();
	const { loadRecords } = dataManager;

	let open = false;
</script>

<Button
	class="!p-2"
	color="alternative"
	on:click={() => {
		open = true;
	}}
>
	<Pencil size="20" />
</Button>

<div class="m-0">
	<Modal bind:open title="Edit record" size="lg">
		<div class="w-[500px]">
			<CrudForm
				mode={formMode.EDIT}
				collection={record.collectionId}
				initialData={record}
				{formSettings}
				on:success={async () => {
					await loadRecords();
					open = false;
				}}
			/>
		</div>
	</Modal>
</div>
