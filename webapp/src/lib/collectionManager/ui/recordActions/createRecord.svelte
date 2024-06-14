<script lang="ts">
	import { createToggleStore } from '$lib/components/utils/toggleStore';

	import { createEventDispatcher } from 'svelte';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { getRecordsManagerContext } from '../../collectionManager.svelte';
	import type { PBResponse } from '$lib/utils/types';

	import { RecordForm } from '$lib/recordForm';
	import { Button, Modal } from 'flowbite-svelte';
	import PortalWrapper from '$lib/components/portalWrapper.svelte';
	import { Plus } from 'svelte-heros-v2';

	//

	type RecordGeneric = $$Generic<PBResponse>;
	export let recordType = createTypeProp<RecordGeneric>();
	recordType;

	export let initialData: Partial<RecordGeneric> = {};
	export let modalTitle = 'Create record';

	//

	const dispatch = createEventDispatcher<{
		success: {
			record: RecordGeneric;
		};
	}>();

	let { collection, dataManager, formFieldsSettings } = getRecordsManagerContext<RecordGeneric>();
	let { base, create } = formFieldsSettings;
	let fieldsSettings = { ...base, ...create };
	let { loadRecords } = dataManager;

	//

	const show = createToggleStore(false);
</script>

<slot name="button" openModal={show.on}>
	<Button class="shrink-0" color="alternative" on:click={show.on}>
		<Plus size="20" />
		<span class="ml-1">
			<slot>Add entry</slot>
		</span>
	</Button>
</slot>

<PortalWrapper>
	<Modal bind:open={$show} title={modalTitle} size="md" placement="center">
		<div class="w-full">
			<slot name="form" closeModal={show.off}>
				<RecordForm
					{collection}
					{fieldsSettings}
					{initialData}
					on:success={async (e) => {
						await loadRecords();
						dispatch('success', { record: e.detail.record });
						show.off();
					}}
				/>
			</slot>
		</div>
	</Modal>
</PortalWrapper>
