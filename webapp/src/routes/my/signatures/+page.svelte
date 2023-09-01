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
	import RecordsManager from '$lib/schema/recordsManager/recordsManager.svelte';
	import RecordsTable from '$lib/schema/recordsManager/views/recordsTable.svelte';
	import { page } from '$app/stores';
	import type { Record, RecordFullListQueryParams } from 'pocketbase';
	import { Button, ButtonGroup, Toast } from 'flowbite-svelte';
	import { Pencil, Share } from 'svelte-heros-v2';
	import ShareSignature from './_partials/ShareSignature.svelte';
	import { slide } from 'svelte/transition';
	import Info from './_partials/Info.svelte';
	import Files from './_partials/Files.svelte';
	import EditRecord from '$lib/schema/recordsManager/recordActions/editRecord.svelte';
	import { createTypeProp } from '$lib/utils/typeProp';
	import type { PBResponse } from '$lib/utils/types';

	const recordType = createTypeProp<SignaturesRecord>();

	$: folderId = $page.url.searchParams.get('folder');

	let initialQueryParams: RecordFullListQueryParams;
	$: if (folderId) {
		initialQueryParams = { filter: `folder.id="${folderId}"`, expand: 'folder' };
	} else {
		initialQueryParams = {expand: 'folder'};
	}

	let shareModal = false;
	let record: (PBResponse<SignaturesRecord>) | undefined = undefined;

	function openShareModal(r: PBResponse<SignaturesRecord>) {
		shareModal = true;
		record = r;
	}

	function clearRecord() {
		record = undefined;
	}

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
				hide: {'owner':$currentUser?.id, 'type':undefined},
				relations: {
					folder: {displayFields:['name'], inputMode:'select'}
				}
			}}
			editFormSettings={{
				exclude: ['owner', 'type', 'file']
			}}
			{initialQueryParams}
			{recordType}
			subscribe={[Collections.Authorizations, Collections.Folders]}
			let:records
		>
			<SignaturesTableHead {folderId} {trigger} />
			<RecordsTable
				{records}
				fields={['info','file']}
				showCheckboxes={false}
				fieldsComponents={{
					info: Info,
					file: Files
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
						<EditRecord {record} let:openModal>
							<Button class="!p-2" color="alternative" on:click={openModal}>
								<Pencil size="20" /> EDIT
							</Button>
						</EditRecord>
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

<Toast simple position="bottom-right" color="indigo" transition={slide} bind:open={show}>
	{content}
</Toast>
