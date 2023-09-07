<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { currentUser } from '$lib/pocketbase';
	import { Collections, type CrudExampleRecord } from '$lib/pocketbase/types';
	import CrudForm from '$lib/schema/CRUDForm.svelte';
	import { createTypeProp } from '$lib/utils/typeProp';

	export let data;
	console.log(data.item);

	const recordType = createTypeProp<CrudExampleRecord>();
</script>

<div class="max-w-xl mx-auto p-4">
	<CrudForm
		{recordType}
		collection={Collections.CrudExample}
		recordId={data.item?.id}
		initialData={data.item}
		fieldsSettings={{
			relations: {
				relation: {
					displayFields: ['name'],
					inputMode: 'select'
				},
				relation_single: { displayFields: ['name'], inputMode: 'search' },
				owner: { displayFields: ['name', 'username', 'email'], inputMode: 'search' }
			},
			hide: { owner: $currentUser?.id }
		}}
		on:success={invalidateAll}
	/>
</div>
