<script lang="ts">
	import { Collections } from '$lib/pocketbase-types';
	import CrudTable from '$lib/schema/CRUDTable.svelte';

	export let data;
	import Chip from '$lib/components/table/cells/chip.svelte';
	import dateTime from '$lib/components/table/cells/dateTime.svelte';
	// import File from '$lib/components/table/cells/file.svelte';
	import { Share } from 'svelte-heros-v2';

</script>

<div class="p-4">
	<CrudTable
		title="My Signatures"
		description="Lorem ipsum dolor sit amet consectetur. Tortor phasellus a feugiat mattis massa sollicitudin bibendum."
		createButtonLabel="Create Signature"
		collection={Collections.Signatures}
		checkBoxes={false}
		fields={['type', 'title', 'created']}
		fieldsDisplay={{
			type: Chip,
			created: dateTime
			// file: File
		}}
		actions={[
			{
				name: 'share',
				icon: Share,	
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
