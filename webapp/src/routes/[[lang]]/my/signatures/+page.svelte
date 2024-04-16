<script lang="ts" context="module">
	import { m } from '$lib/i18n';
	const toasts = {
		add: m._Signature_shared_successfully(),
		remove: m._Signature_unshared_successfully(),
		signed: m._Document_signed_successfully()
	};
	export type ToastContent = keyof typeof toasts;
</script>

<script lang="ts">
	import SignaturesTableHead from '$lib/components/signaturesTableHead.svelte';

	import { currentUser } from '$lib/pocketbase';
	import {
		Collections,
		type FoldersResponse,
		type SignaturesRecord,
		type SignaturesResponse
	} from '$lib/pocketbase/types';
	import { CollectionManager, CollectionTable, EditRecord } from '$lib/collectionManager';
	import { page } from '$app/stores';
	import type { RecordFullListOptions } from 'pocketbase';
	import { Button, ButtonGroup, Toast } from 'flowbite-svelte';
	import { Pencil, Share } from 'svelte-heros-v2';
	import ShareSignature from './_partials/ShareSignature.svelte';
	import { slide } from 'svelte/transition';
	import Info from './_partials/Info.svelte';
	import Files from './_partials/Files.svelte';
	import { createTypeProp } from '$lib/utils/typeProp';
	import CollectionEmptyState from '$lib/collectionManager/ui/collectionEmptyState.svelte';
	import PageTop from '$lib/components/pageTop.svelte';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import PageCard from '$lib/components/pageCard.svelte';
	import PageContent from '$lib/components/pageContent.svelte';

	const recordType = createTypeProp<SignaturesResponse<FoldersResponse>>();

	$: folderId = $page.url.searchParams.get('folder');

	let initialQueryParams: RecordFullListOptions;
	$: if (folderId) {
		initialQueryParams = { filter: `folder.id="${folderId}"`, expand: 'folder' };
	} else {
		initialQueryParams = { expand: 'folder' };
	}

	let shareModal = false;
	let record: SignaturesResponse | undefined = undefined;

	function openShareModal(r: SignaturesResponse) {
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

<PageContent>
	<PageCard>
		{#key initialQueryParams}
			<CollectionManager
				collection={Collections.Signatures}
				formSettings={{
					hide: { owner: $currentUser?.id, type: undefined },
					relations: {
						folder: { displayFields: ['name'], inputMode: 'select' }
					},
					exclude: ['signed_file']
				}}
				editFormSettings={{
					exclude: ['owner', 'type', 'file']
				}}
				{initialQueryParams}
				{recordType}
				subscribe={[Collections.Authorizations, Collections.Folders]}
				let:records
				hideEmptyState
			>
				<SignaturesTableHead {folderId} {trigger} />
				<CollectionTable
					{records}
					fields={['_info', 'file']}
					hideActions={['select', 'delete', 'edit', 'share']}
					fieldsComponents={{
						_info: Info,
						file: Files
					}}
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
								<Share size="12" class="mr-1" />{m.SHARE()}
							</Button>
							<EditRecord {record} let:openModal>
								<Button
									class="!p-2 rounded-r-lg"
									color="alternative"
									size="xs"
									on:click={openModal}
								>
									<Pencil size="12" class="mr-1" />{m.EDIT()}
								</Button>
							</EditRecord>
						</ButtonGroup>
					{:else}
						<div />
					{/if}
					<svelte:fragment slot="emptyState">
						<CollectionEmptyState
							title="No signatures yet"
							description="Start signing a document"
							hideCreateButton
						/>
					</svelte:fragment>
				</CollectionTable>
			</CollectionManager>
		{/key}

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
	</PageCard>
</PageContent>

<Toast position="bottom-right" color="indigo" transition={slide} bind:open={show}>
	{content}
</Toast>
