<script lang="ts">
	import { Collections } from '$lib/pocketbase-types';
	import CrudTable from '$lib/schema/CRUDTable.svelte';

	export let data;
	import Chip from '$lib/components/table/cells/chip.svelte';
	import File from '$lib/components/table/cells/file.svelte';
</script>

<div class="p-4">
	<CrudTable
		collection={Collections.Signatures}
		fields={['type', 'title', 'file', 'folder', 'description']}
		fieldsDisplay={{
			type: Chip,
			file: File
		}}
		actions={[
			{
				name: 'more',
				function: (r) => {
					console.log(r);
				}
			}
		]}
		relationsDisplayFields={{
			folder: ['name'],
			owner: ['email', 'username']
		}}
		formHiddenFields={['owner']}
		formHiddenFieldsValues={{ owner: data.user?.id }}
	/>
</div>
