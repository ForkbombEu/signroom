<script lang="ts">
	import type { PBRecord, PBResponse } from '$lib/utils/types';
	import { getRecordsManagerContext } from '../../collectionManager.svelte';

	import { Button, Modal, P } from 'flowbite-svelte';
	import { Trash, XMark } from 'svelte-heros-v2';
	import ModalWrapper from '$lib/components/modalWrapper.svelte';

	type RecordGeneric = $$Generic<PBRecord>;
	export let record: PBResponse<RecordGeneric>;

	const { dataManager } = getRecordsManagerContext();
	const { loadRecords, recordService } = dataManager;

	async function deleteRecord() {
		await recordService.delete(record.id);
		loadRecords();
		open = false;
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
