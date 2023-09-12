<script lang="ts">
	import { createTypeProp } from '$lib/utils/typeProp';

	import type { PBRecord, PBResponse } from '$lib/utils/types';
	import { RecordForm } from '$lib/recordForm';

	import ModalWrapper from '$lib/components/modalWrapper.svelte';
	import { Button, Modal } from 'flowbite-svelte';
	import { Pencil } from 'svelte-heros-v2';
	import { getRecordsManagerContext } from '../../collectionManager.svelte';

	//

	type RecordGeneric = $$Generic<PBRecord>;
	export let recordType = createTypeProp<RecordGeneric>();
	recordType;

	export let record: PBResponse<RecordGeneric>;

	//

	const { dataManager, formFieldsSettings } = getRecordsManagerContext<RecordGeneric>();
	const { base, edit } = formFieldsSettings;
	const { loadRecords } = dataManager;

	const fieldsSettings = {
		...base,
		...edit
	};

	//

	let open = false;

	function openModal() {
		open = true;
	}
</script>

<slot {openModal}>
	<Button class="!p-2" color="alternative" on:click={openModal}>
		<Pencil size="20" />
	</Button>
</slot>

<ModalWrapper>
	<Modal bind:open title="Edit record" size="lg">
		<div class="w-[500px]">
			<RecordForm
				collection={record.collectionId}
				recordId={record.id}
				initialData={record}
				{fieldsSettings}
				on:success={async () => {
					await loadRecords();
					open = false;
				}}
			/>
		</div>
	</Modal>
</ModalWrapper>
