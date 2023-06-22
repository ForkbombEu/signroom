<script lang="ts">
	import { Collections } from '$lib/pocketbase-types';
	import CrudTable from '$lib/schema/CRUDTable.svelte';

	export let data;
</script>

<div class="p-4">
	<CrudTable
		collection={Collections.Folders}
		fields={['name']}
		formHiddenFields={['owner']}
		formHiddenFieldsValues={{ owner: data.user?.id }}
	/>
</div>
