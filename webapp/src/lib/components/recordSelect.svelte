<script lang="ts">
	import { record } from 'zod';

	import { createEventDispatcher } from 'svelte';
	import type { SelectOptionType } from 'flowbite-svelte/dist/types';

	import { pb } from '$lib/pocketbase';
	import type { Record } from 'pocketbase';
	import { Select, Spinner } from 'flowbite-svelte';

	//

	export let collection: string;
	export let displayFields: string[];
	export let disabled = false;
	export let name = '';
	export let exclude: string[] = [];

	//

	type RecordGeneric = $$Generic;
	type R = RecordGeneric & Record;

	$: recordsPromise = loadRecords(exclude);
	let records: R[] = [];

	async function loadRecords(exclude: string[]) {
		const res = await pb.collection(collection).getFullList<R>({ $autoCancel: false });
		records = res.filter((r) => !exclude.includes(r.id));
		return records;
	}

	//

	function createLabel(record: R) {
		return displayFields
			.map((f) => record[f])
			.filter((f) => Boolean(f))
			.join(' | ');
	}

	function createItems(records: R[]): SelectOptionType[] {
		return records.map((r) => ({ name: createLabel(r), value: r.id }));
	}

	//

	let value: string;

	const dispatch = createEventDispatcher<{ select: { record: R } }>();

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
