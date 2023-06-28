<script lang="ts">
	import Chip from '$lib/components/table/cells/chip.svelte';
	import File from '$lib/components/table/cells/file.svelte';
	import { currentUser } from '$lib/pocketbase';
	import { Collections, type CrudExampleRecord } from '$lib/pocketbase-types';
	import RecordsManager, {
		createSlotTypeCaster
	} from '$lib/schema/recordsManager/recordsManager.svelte';
	import RecordsManagerTopbar from '$lib/schema/recordsManager/recordsManagerTopbar.svelte';
	import RecordsTable from '$lib/schema/recordsManager/views/recordsTable.svelte';

	const slotTypeCaster = createSlotTypeCaster<CrudExampleRecord>();
</script>

<div class="p-4">
	<RecordsManager
		collection={Collections.Signatures}
		formSettings={{
			hiddenFields: ['owner'],
			hiddenFieldsValues: { owner: $currentUser?.id }
		}}
		{slotTypeCaster}
		let:records
	>
		<RecordsManagerTopbar />
		<RecordsTable
			{records}
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
		/>
	</RecordsManager>
</div>
