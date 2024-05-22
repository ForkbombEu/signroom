<script lang="ts">
	import type { FormSettings } from '$lib/forms/form.svelte';

	import { createTypeProp } from '$lib/utils/typeProp';

	import type { PBResponse } from '$lib/utils/types';
	import { RecordForm } from '$lib/recordForm';

	import PortalWrapper from '$lib/components/portalWrapper.svelte';
	import { Button, Modal } from 'flowbite-svelte';
	import { Pencil } from 'svelte-heros-v2';
	import { getRecordsManagerContext } from '../../collectionManager.svelte';

	//

	type RecordGeneric = $$Generic<PBResponse>;
	export let recordType = createTypeProp<RecordGeneric>();
	recordType;

	export let record: RecordGeneric;
	export let formSettings: Partial<FormSettings> = {};
	export let modalTitle = 'Edit record';

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

<PortalWrapper>
	<Modal bind:open title={modalTitle} size="md">
		<div class="w-full">
			<RecordForm
				collection={record.collectionId}
				recordId={record.id}
				initialData={record}
				{formSettings}
				{fieldsSettings}
				on:success={async () => {
					await loadRecords();
					open = false;
				}}
			/>
		</div>
	</Modal>
</PortalWrapper>
