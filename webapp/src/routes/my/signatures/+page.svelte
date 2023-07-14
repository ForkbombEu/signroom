<script lang="ts" context="module">
	const toasts = {
		add: '✅ Signature shared successfully',
		remove: '✅ Signature unshared successfully',
		signed: '✅ Document signed successfully'
	};
	export type ToastContent = keyof typeof toasts;
</script>

<script lang="ts">
	import SignaturesTableHead from '$lib/components/signaturesTableHead.svelte';

	import { currentUser } from '$lib/pocketbase';
	import { Collections, type SignaturesRecord } from '$lib/pocketbase-types';
	import RecordsManager, {
		createSlotTypeCaster
	} from '$lib/schema/recordsManager/recordsManager.svelte';
	import RecordsTable from '$lib/schema/recordsManager/views/recordsTable.svelte';
	import { page } from '$app/stores';
	import type { Record, RecordFullListQueryParams } from 'pocketbase';
	import SignaturesFoldersHead from '$lib/components/signaturesFoldersHead.svelte';
	import { Button, ButtonGroup, Toast } from 'flowbite-svelte';
	import { Share } from 'svelte-heros-v2';
	import ShareSignature from './_partials/ShareSignature.svelte';
	import { slide } from 'svelte/transition';
	import Info from './_partials/Info.svelte';
	import Files from './_partials/Files.svelte';
	import EditRecord from '$lib/schema/recordsManager/recordActions/editRecord.svelte';

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

	// /* Toasts */

	// const toasts = {
	// 	add: '✅ Signature shared successfully',
	// 	remove: '✅ Signature unshared successfully',
	// 	signed: '✅ Document signed successfully'
	// };

	let show = false;
	let content: string | undefined = undefined;
	const duration = 2000;

	function trigger(key: ToastContent) {
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
				hiddenFieldsValues: { owner: $currentUser?.id },
				relationsDisplayFields: {
					folder: ['name']
				},
				relationsInputMode: {
					folder: 'select'
				}
			}}
			editFormSettings={{
				excludedFields: ['owner', 'type', 'file']
			}}
			{initialQueryParams}
			{slotTypeCaster}
			subscribe={[Collections.Authorizations, Collections.Folders]}
			let:records
		>
			<SignaturesTableHead {folderId} {trigger} />
			<RecordsTable
				{records}
				fields={['info', 'files']}
				showCheckboxes={false}
				fieldsComponents={{
					info: Info,
					files: Files
				}}
				showDelete={false}
				showEdit={false}
				let:record
			>
				{#if record.owner == $currentUser?.id}
					<ButtonGroup size="xs">
						<Button
							class="!p-2"
							size="xs"
							on:click={() => {
								openShareModal(record);
							}}
						>
							<Share size="12" class="mr-1" /> SHARE
						</Button>
						<EditRecord {record} label="EDIT" />
					</ButtonGroup>
				{:else}
					<div />
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
