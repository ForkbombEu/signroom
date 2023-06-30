<script lang="ts">
	import SignaturesTableHead from '$lib/components/signaturesTableHead.svelte';
import Chip from '$lib/components/table/cells/chip.svelte';
import Description from '$lib/components/table/cells/description.svelte';

	import File from '$lib/components/table/cells/file.svelte';
	import { currentUser } from '$lib/pocketbase';
	import { Collections, type CrudExampleRecord } from '$lib/pocketbase-types';
	import RecordsManager, {
		createSlotTypeCaster
	} from '$lib/schema/recordsManager/recordsManager.svelte';
	import RecordsTable from '$lib/schema/recordsManager/views/recordsTable.svelte';
	const slotTypeCaster = createSlotTypeCaster<CrudExampleRecord>();
</script>

<div class="p-4">
	<RecordsManager
		collection={Collections.Signatures}
		formSettings={{
			hiddenFields: ['owner', 'type'],
			hiddenFieldsValues: { owner: $currentUser?.id, type: '' }
		}}
		{slotTypeCaster}
		let:records
	>
		<SignaturesTableHead/>
		<RecordsTable
			{records}
			fields={['type', 'title', 'file', 'folder', 'description']}
			showCheckboxes={false}
			fieldsDisplay={{
				type: Chip,
				file: File,
				description: Description,
			}}
		/>
	</RecordsManager>
</div>
