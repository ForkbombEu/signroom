<script lang="ts">
	import { Collections } from '$lib/pocketbase-types';
	import CrudForm, { formMode } from '$lib/schema/CRUDForm.svelte';

	export let data;
</script>

<div class="max-w-xl mx-auto p-4">
	<CrudForm
		mode={formMode.EDIT}
		collection={Collections.CrudExample}
		initialData={data.item}
		relationsDisplayFields={{
			relation: ['name'],
			relation_single: ['name'],
			owner: ['name', 'username', 'email']
		}}
		hiddenFields={['owner']}
		hiddenFieldsValues={{ owner: data.user?.id }}
	/>
</div>
