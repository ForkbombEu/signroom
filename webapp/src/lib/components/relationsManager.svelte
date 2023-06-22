<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { Collections } from '$lib/pocketbase-types';
	import type { Record as PBRecord } from 'pocketbase';

	// @ts-ignore
	import Svelecte from 'svelecte';
	import ArrayManager from './arrayManager.svelte';
	import { onMount } from 'svelte';
	import { getCollectionSchema } from '$lib/schema/getCollectionSchema';

	//

	export let relation: string[] | string;
	export let collection: string | Collections;
	export let multiple: boolean;
	export let displayFields: string[];
	export let name = '';
	export let max: number | undefined = undefined;

	//

	let tempIDs: string[] = [];
	if (Array.isArray(relation)) tempIDs = relation;
	else if (relation) tempIDs = [relation];

	$: relation = multiple ? tempIDs : tempIDs[0];

	//

	let tempRecords: Record<string, PBRecord> = {};

	onMount(async () => {
		const initialData = await Promise.all(
			tempIDs.map((id) => pb.collection(collection).getOne(id, { $autoCancel: false }))
		);
		initialData.forEach((d) => {
			tempRecords[d.id] = d;
		});
	});

	//

	function getCollectionFieldNames(): string[] {
		const fieldNames: string[] = ['id'];
		//
		if (collection == '_pb_users_auth_' || collection == Collections.Users) {
			fieldNames.push('username');
			fieldNames.push('email');
		}
		//
		const collectionSchema = getCollectionSchema(collection);
		if (collectionSchema) {
			collectionSchema.schema.forEach((fs) => {
				fieldNames.push(fs.name);
			});
		}
		//
		return fieldNames;
	}

	function buildFilterString(text: string) {
		return getCollectionFieldNames()
			.map((f) => `${f}~"${text}"`)
			.join(' || ');
	}

	//

	const valueField = 'data';
	const labelField = 'label';

	async function fetchOptions(text: string) {
		const data = await pb.collection(collection).getFullList({
			filter: buildFilterString(text)
		});
		const options = data.map((d) => {
			return {
				[valueField]: d,
				[labelField]: getCollectionFieldNames()
					.map((f) => d[f])
					.filter((f) => Boolean(f))
					.join(' | ')
			};
		});
		return options;
	}

	let selectValue: null;

	function handleSelect(e: CustomEvent<Record<string, PBRecord>>) {
		const data = e.detail[valueField];
		tempRecords[data.id] = data;
		if (multiple) tempIDs = [...tempIDs, data.id];
		else tempIDs = [data.id];
		selectValue = null;
	}

	//

	function buildRecordString(id: string) {
		return displayFields
			.map((f) => tempRecords[id][f])
			.filter((f) => Boolean(f))
			.join(' | ');
	}

	$: disabled = Boolean(max) && tempIDs.length >= (max as number);
	$: placeholder = disabled ? `Max items selected (${max})` : 'Search';
</script>

<Svelecte
	{name}
	{valueField}
	{labelField}
	fetch={fetchOptions}
	valueAsObject
	clearable
	bind:value={selectValue}
	on:change={handleSelect}
	{disabled}
	{placeholder}
/>
<ArrayManager bind:array={tempIDs} let:item>
	{@const record = tempRecords[item]}
	{#if record}
		{buildRecordString(record.id)}
	{/if}
</ArrayManager>
