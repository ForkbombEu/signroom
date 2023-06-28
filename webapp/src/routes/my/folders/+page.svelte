<script lang="ts">
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
		collection={Collections.Folders}
		formSettings={{
			hiddenFields: ['owner'],
			hiddenFieldsValues: { owner: $currentUser?.id }
		}}
		{slotTypeCaster}
		let:records
	>
		<RecordsManagerTopbar />
		<RecordsTable {records} fields={['id', 'name']} />
	</RecordsManager>
</div>
