<script lang="ts">
	import { Button, Modal, P } from 'flowbite-svelte';
	import { Trash, XMark } from 'svelte-heros-v2';
	import { getRecordsManagerContext } from '../recordsManager.svelte';
	import type { Record } from 'pocketbase';
	import ModalWrapper from '$lib/components/modalWrapper.svelte';

	export let record: Record;

	const { dataManager } = getRecordsManagerContext();
	const { loadRecords, recordService } = dataManager;

	async function deleteRecord() {
		await recordService.delete(record.id);
		loadRecords();
	}

	let open = false;
</script>

<Button
	class="!p-2"
	color="alternative"
	on:click={() => {
		open = true;
	}}
>
	<Trash size="20" />
</Button>

<ModalWrapper>
	<Modal bind:open title="Delete record" size="xs">
		<div class="text-center space-y-6">
			<P>Are you sure you want to delete this record?</P>
			<div class="flex gap-2 justify-center">
				<Button color="red" on:click={deleteRecord}>
					<Trash size="20" /><span class="ml-1">Delete</span>
				</Button>
				<Button
					color="alternative"
					on:click={() => {
						open = false;
					}}
				>
					<XMark size="20" />
					<span class="ml-1">Cancel</span>
				</Button>
			</div>
		</div>
	</Modal>
</ModalWrapper>
