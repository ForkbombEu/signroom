<script lang="ts">
	import SignaturesTableHead from '$lib/components/signaturesTableHead.svelte';
	import Description from '$lib/components/table/cells/description.svelte';
	import Chip from '$lib/schema/recordsManager/views/fieldsComponents/cells/chip.svelte';
	import File from '$lib/schema/recordsManager/views/fieldsComponents/cells/file.svelte';

	import { currentUser } from '$lib/pocketbase';
	import { Collections, type CrudExampleRecord } from '$lib/pocketbase-types';
	import RecordsManager, {
		createSlotTypeCaster
	} from '$lib/schema/recordsManager/recordsManager.svelte';
	import RecordsTable from '$lib/schema/recordsManager/views/recordsTable.svelte';
	import { page } from '$app/stores';
	import type { RecordFullListQueryParams } from 'pocketbase';
	import SignaturesFoldersHead from '$lib/components/signaturesFoldersHead.svelte';
	import SignedFileDisplay from './_partials/SignedFileDisplay.svelte';
	const slotTypeCaster = createSlotTypeCaster<CrudExampleRecord>();

	$: folderId = $page.url.searchParams.get('folder');

	let initialQueryParams: RecordFullListQueryParams;
	$: if (folderId) {
		initialQueryParams = { filter: `folder.id="${folderId}"` };
	} else {
		initialQueryParams = {};
	}
</script>

<div class="p-4">
	{#key initialQueryParams}
		<RecordsManager
			collection={Collections.Signatures}
			formSettings={{
				hiddenFields: ['owner', 'type'],
				hiddenFieldsValues: { owner: $currentUser?.id, type: '' },
				relationsDisplayFields: {
					folder: ['name']
				}
			}}
			{initialQueryParams}
			{slotTypeCaster}
			let:records
		>
			{#if !folderId}
				<SignaturesTableHead />
			{:else}
				<SignaturesFoldersHead {folderId} />
			{/if}
      <RecordsTable
        {records}
        fields={['type', 'title', 'file', 'signed_file','description']}
        showCheckboxes={false}
        fieldsComponents={{
          type: Chip,
          file: File,
          description: Description,
          //@ts-ignore
          signed_file:SignedFileDisplay
        }}
      />
		</RecordsManager>
	{/key}
</div>
