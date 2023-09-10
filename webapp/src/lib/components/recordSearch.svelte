<script lang="ts">
	import { createTypeProp } from '$lib/utils/typeProp';

	import { pb } from '$lib/pocketbase';
	import { Collections } from '$lib/pocketbase/types';

	// @ts-ignore
	import Svelecte from 'svelecte';
	import { getCollectionSchema } from '$lib/schema/getCollectionSchema';
	import { createEventDispatcher } from 'svelte';

	import type { PBRecord, PBResponse } from '$lib/utils/types';

	//

	export let collection: string | Collections;
	export let disabled = false;
	export let name = '';
	export let exclude: string[] = [];

	type RecordGeneric = $$Generic<PBRecord>;
	export let recordType = createTypeProp<RecordGeneric>();
	recordType;

	//

	const valueField = 'data';
	const labelField = 'label';

	async function fetchOptions(text: string) {
		let data = await pb.collection(collection).getFullList<PBResponse<RecordGeneric>>({
			$autoCancel: false,
			filter: buildFilterString(text)
		});
		data = data.filter((r) => !exclude.includes(r.id));
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

	function buildFilterString(text: string) {
		return getCollectionFieldNames()
			.map((f) => `${f}~"${text}"`)
			.join(' || ');
	}

	function getCollectionFieldNames(): string[] {
		const fieldNames: string[] = [];

		if (collection == '_pb_users_auth_' || collection == Collections.Users) {
			fieldNames.push('username');
			fieldNames.push('email');
		}

		const collectionSchema = getCollectionSchema(collection);
		if (collectionSchema) {
			collectionSchema.schema.forEach((field) => {
				fieldNames.push(field.name);
			});
		}

		fieldNames.push('id');

		return fieldNames;
	}

	//

	let value: { [valueField]: PBResponse<RecordGeneric>; [labelField]: string } | undefined;

	const dispatch = createEventDispatcher<{ select: { record: PBResponse<RecordGeneric> } }>();

	function handleChange() {
		if (!value) return;
		dispatch('select', { record: value.data });
		value = undefined;
	}
</script>

<Svelecte
	{name}
	{valueField}
	{labelField}
	fetch={fetchOptions}
	valueAsObject
	bind:value
	on:change={handleChange}
	{disabled}
/>
