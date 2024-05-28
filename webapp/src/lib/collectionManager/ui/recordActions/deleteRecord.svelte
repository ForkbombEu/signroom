<script lang="ts">
	import { onDestroy } from 'svelte';
	import { getErrorMessage } from '$lib/errorHandling';

	import PortalWrapper from '$lib/components/portalWrapper.svelte';

	import type { PBResponse } from '$lib/utils/types';
	import { getRecordsManagerContext } from '../../collectionManager.svelte';

	import { Alert, Button, Modal, P } from 'flowbite-svelte';
	import { Trash, XMark } from 'svelte-heros-v2';

	type RecordGeneric = $$Generic<PBResponse>;
	export let record: RecordGeneric;

	export let modalTitle = 'Delete record';

	const { dataManager } = getRecordsManagerContext();
	const { loadRecords, recordService } = dataManager;

	let error: string | undefined = undefined;

	async function deleteRecord() {
		error = undefined;
		try {
			await recordService.delete(record.id);
			loadRecords();
			open = false;
		} catch (e) {
			error = getErrorMessage(e);
		}
	}

	onDestroy(() => {
		error = undefined;
	});

	let open = false;

	function openModal() {
		open = true;
	}
</script>

<slot {openModal}>
	<Button class="!p-2" color="alternative" on:click={openModal}>
		<Trash size="20" />
	</Button>
</slot>

<PortalWrapper>
	<Modal bind:open title={modalTitle} size="xs">
		<div class="space-y-6 text-center">
			<P>Are you sure you want to delete this record?</P>

			{#if error}
				<Alert color="red" class="text-left" dismissable>
					<p class="font-bold">Error</p>
					<p>{error}</p>
				</Alert>
			{/if}

			<div class="flex justify-center gap-2">
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
</PortalWrapper>
