<script lang="ts">
	import { createTypeProp } from '$lib/utils/typeProp';

	import { createEventDispatcher } from 'svelte';
	import type { SelectOptionType } from 'flowbite-svelte/dist/types';
	import type { PBResponse, PBRecord } from '$lib/utils/types';

	import { pb } from '$lib/pocketbase';
	import { Select, Spinner } from 'flowbite-svelte';

	//

	export let collection: string;
	export let displayFields: string[];
	export let disabled = false;
	export let name = '';
	export let exclude: string[] = [];

	//

	type RecordGeneric = $$Generic<PBRecord>;
	export let recordType = createTypeProp<RecordGeneric>();
	recordType;

	$: recordsPromise = loadRecords(exclude);
	let records: PBResponse<RecordGeneric>[] = [];

	async function loadRecords(exclude: string[]) {
		const res = await pb
			.collection(collection)
			.getFullList<PBResponse<RecordGeneric>>({ $autoCancel: false });
		records = res.filter((r) => !exclude.includes(r.id));
		return records;
	}

	//

	function createLabel(record: PBResponse<RecordGeneric>) {
		return displayFields
			.map((f) => record[f])
			.filter((f) => Boolean(f))
			.join(' | ');
	}

	function createItems(records: PBResponse<RecordGeneric>[]): SelectOptionType[] {
		return records.map((r) => ({ name: createLabel(r), value: r.id }));
	}

	//

	let value: string;

	const dispatch = createEventDispatcher<{ select: { record: PBResponse<RecordGeneric> } }>();

	function handleChange() {
		const record = records.find((r) => r.id == value);
		if (!record) return;
		dispatch('select', { record });
		value = '';
	}
</script>

{#await recordsPromise}
	<Spinner />
{:then records}
	{@const items = createItems(records)}
	<Select {disabled} {name} {items} bind:value on:change={handleChange} />
{/await}
