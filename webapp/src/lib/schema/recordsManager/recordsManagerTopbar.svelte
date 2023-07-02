<script lang="ts">
	import { Button, Heading, Modal, P } from 'flowbite-svelte';
	import { getRecordsManagerContext } from './recordsManager.svelte';
	import { Plus, Trash, XMark } from 'svelte-heros-v2';
	import CrudForm, { formMode } from '../CRUDForm.svelte';
	import CreateRecord from './recordActions/createRecord.svelte';

	//

	const { collection, selectionManager, dataManager, formSettings } = getRecordsManagerContext();
	const { recordService, loadRecords } = dataManager;
	const { selectedRecords, discardSelection } = selectionManager;

	let showDeleteModal = false;

	async function deleteSelection() {
		if (!$selectedRecords.length) return;
		await Promise.all([...$selectedRecords.map((id) => recordService.delete(id))]);
		loadRecords();
		discardSelection();
	}
</script>

<div class="flex justify-between items-center mb-4">
	<Heading tag="h4">{collection}</Heading>
	<div class="shrink-0 flex space-x-4 items-center">
		{#if $selectedRecords.length > 0}
			<P><span class="font-bold">{$selectedRecords.length}</span> selected</P>
			<div class="flex space-x-2 items-center">
				<Button color="alternative" on:click={discardSelection}>
					<XMark size="20" />
					<span class="ml-1">Discard</span>
				</Button>
				<Button
					color="alternative"
					on:click={() => {
						showDeleteModal = true;
					}}
				>
					<Trash size="20" />
					<span class="ml-1">Delete</span>
				</Button>
			</div>
		{:else}
			<div class="flex space-x-2 items-center">
			  <CreateRecord />
			  <slot name="actions" />
			</div>
		{/if}
	</div>
</div>

<div class="m-0">
	<Modal bind:open={showDeleteModal} title="Delete records" size="xs">
		<div class="text-center space-y-6">
			<P>
				Are you sure you want to delete <span class="font-bold">{$selectedRecords.length}</span> records?
			</P>
			<div class="flex gap-2 justify-center">
				<Button color="red" on:click={deleteSelection}>Delete</Button>
				<Button
					color="alternative"
					on:click={() => {
						showDeleteModal = false;
					}}>Cancel</Button
				>
			</div>
		</div>
	</Modal>
</div>
