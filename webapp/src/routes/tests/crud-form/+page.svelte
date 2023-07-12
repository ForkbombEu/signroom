<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { currentUser } from '$lib/pocketbase';
	import { Collections } from '$lib/pocketbase-types';
	import CrudForm, { formMode } from '$lib/schema/CRUDForm.svelte';

	export let data;
</script>

<div class="max-w-xl mx-auto p-4">
	<CrudForm
		mode={formMode.EDIT}
		collection={Collections.CrudExample}
		initialData={data.item}
		formSettings={{
			relationsDisplayFields: {
				relation: ['name'],
				relation_single: ['name'],
				owner: ['name', 'username', 'email']
			},
			relationsInputMode: {
				relation: 'select',
				relation_single: 'search',
				owner: 'search'
			},
			hiddenFields: ['owner'],
			hiddenFieldsValues: { owner: $currentUser?.id }
		}}
		on:success={invalidateAll}
	/>
</div>
