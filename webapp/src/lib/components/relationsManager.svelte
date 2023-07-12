<script lang="ts" context="module">
	export type InputMode = 'search' | 'select';
</script>

<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import type { Record as PBRecord } from 'pocketbase';

	import RecordSelect from './recordSelect.svelte';
	import RecordSearch from './recordSearch.svelte';
	import ArrayOrItemManager from './arrayOrItemManager.svelte';

	//

	export let relation: string[] | string;
	export let collection: string;
	export let displayFields: string[];
	export let multiple = false;
	export let name = '';
	export let max: number | undefined = undefined;
	export let mode: InputMode = 'search';

	//

	let tempIDs: string[] = [];
	let tempRecords: Record<string, PBRecord> = {};
	$: {
		if (Array.isArray(relation)) tempIDs = relation;
		else if (relation) tempIDs = [relation];
		loadRecords();
	}

	async function loadRecords() {
		const data = await Promise.all(
			tempIDs.map((id) => pb.collection(collection).getOne(id, { $autoCancel: false }))
		);
		data.forEach((d) => {
			tempRecords[d.id] = d;
		});
	}

	function buildRecordString(id: string) {
		return displayFields
			.map((f) => tempRecords[id][f])
			.filter((f) => Boolean(f))
			.join(' | ');
	}

	//

	$: disabled = multiple && !!max && relation.length >= max;

	function handleSelect(e: CustomEvent<{ record: PBRecord }>) {
		const data = e.detail.record;
		if (multiple) relation = [...relation, data.id];
		else relation = data.id;
	}
</script>

{#if mode == 'search'}
	<RecordSearch on:select={handleSelect} {collection} {name} {disabled} exclude={tempIDs} />
{:else}
	<RecordSelect
		on:select={handleSelect}
		{collection}
		{name}
		{displayFields}
		{disabled}
		exclude={tempIDs}
	/>
{/if}

<ArrayOrItemManager bind:value={relation} let:item>
	{@const record = tempRecords[item]}
	{#if record}
		{buildRecordString(record.id)}
	{/if}
</ArrayOrItemManager>
