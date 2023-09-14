<script lang="ts">
	import { getRecordsManagerContext } from '../../collectionManager.svelte';
	import type { PBRecord, PBResponse } from '$lib/utils/types';
	import { Checkbox } from 'flowbite-svelte';

	type RecordGeneric = $$Generic<PBRecord>;
	export let record: PBResponse<RecordGeneric>;

	const { selectionManager } = getRecordsManagerContext();
	const { selectedRecords } = selectionManager;
</script>

<Checkbox bind:group={$selectedRecords} value={record.id} name="select" />
