<script lang="ts">
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
			hiddenFields: ['owner'],
			hiddenFieldsValues: { owner: $currentUser?.id }
		}}
	/>
</div>
