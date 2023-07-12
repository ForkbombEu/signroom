<script lang="ts">
	import SignaturesTableHead from '$lib/components/signaturesTableHead.svelte';
	import Description from '$lib/components/table/cells/description.svelte';
	import Chip from '$lib/schema/recordsManager/views/fieldsComponents/cells/chip.svelte';
	import File from '$lib/schema/recordsManager/views/fieldsComponents/cells/file.svelte';

	import { currentUser } from '$lib/pocketbase';
	import { Collections, type SignaturesRecord } from '$lib/pocketbase-types';
	import RecordsManager, {
		createSlotTypeCaster
	} from '$lib/schema/recordsManager/recordsManager.svelte';
	import RecordsTable from '$lib/schema/recordsManager/views/recordsTable.svelte';
	import { page } from '$app/stores';
	import type { Record, RecordFullListQueryParams } from 'pocketbase';
	import SignaturesFoldersHead from '$lib/components/signaturesFoldersHead.svelte';
	import SignedFileDisplay from './_partials/SignedFileDisplay.svelte';
	import { Button, Toast } from 'flowbite-svelte';
	import { Share } from 'svelte-heros-v2';
	import ShareSignature from './_partials/ShareSignature.svelte';
	import OwnerDisplay from './_partials/OwnerDisplay.svelte';
	import { slide } from 'svelte/transition';

	const slotTypeCaster = createSlotTypeCaster<SignaturesRecord>();

	$: folderId = $page.url.searchParams.get('folder');

	let initialQueryParams: RecordFullListQueryParams;
	$: if (folderId) {
		initialQueryParams = { filter: `folder.id="${folderId}"` };
	} else {
		initialQueryParams = {};
	}

	let shareModal = false;
	let record: (Record & SignaturesRecord) | undefined = undefined;

	function openShareModal(r: SignaturesRecord & Record) {
		shareModal = true;
		record = r;
	}

	function clearRecord() {
		record = undefined;
	}

	/* Toasts */

	const toasts = {
		add: '✅ Signature shared successfully',
		remove: '✅ Signature unshared successfully'
	};

	type Toast = keyof typeof toasts;

	let show = false;
	let content: string | undefined = undefined;
	const duration = 2000;

	function trigger(key: Toast) {
		show = true;
		content = toasts[key];
		setTimeout(() => {
			show = false;
			content = undefined;
		}, duration);
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
				},
				relationsInputMode: {
					folder: 'select'
				}
			}}
			{initialQueryParams}
			{slotTypeCaster}
			let:records
		>
			<SignaturesTableHead {folderId} />
			<RecordsTable
				{records}
				fields={['type', 'owner', 'title', 'file', 'signed_file', 'description']}
				showCheckboxes={false}
				fieldsComponents={{
					type: Chip,
					file: File,
					description: Description,
					owner: OwnerDisplay,
					//@ts-ignore
					signed_file: SignedFileDisplay
				}}
				let:record
			>
				{#if record.owner == $currentUser?.id}
					<Button
						class="!p-2"
						color="alternative"
						on:click={() => {
							openShareModal(record);
						}}
					>
						<Share size="20" />
					</Button>
				{/if}
			</RecordsTable>
		</RecordsManager>
	{/key}
</div>

{#key record}
	{#if record}
		<ShareSignature
			bind:open={shareModal}
			{record}
			on:add={() => {
				trigger('add');
			}}
			on:remove={() => {
				trigger('remove');
			}}
		/>
	{/if}
{/key}

<Toast simple position="bottom-right" color="dark" transition={slide} bind:open={show}>
	{content}
</Toast>
