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
	import { currentUser } from '$lib/pocketbase';
	import {
		Collections,
		SignaturesTypeOptions,
		type FoldersResponse,
		type SignaturesRecord,
		type SignaturesResponse
	} from '$lib/pocketbase/types';
	import {
		CollectionManager,
		CollectionTable,
		CreateRecord,
		EditRecord
	} from '$lib/collectionManager';
	import { page } from '$app/stores';
	import type { RecordFullListOptions } from 'pocketbase';
	import {
		Alert,
		Button,
		ButtonGroup,
		Spinner,
		Toast,
		A,
		Dropdown,
		DropdownItem
	} from 'flowbite-svelte';
	import { Pencil, Plus, Share } from 'svelte-heros-v2';
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
	import PlainCard from '$lib/components/plainCard.svelte';
	import DeleteRecord from '$lib/collectionManager/ui/recordActions/deleteRecord.svelte';
	import Icon from '$lib/components/icon.svelte';
	import { ArrowLeft } from 'svelte-heros';
	import type { FieldsSettings } from '$lib/recordForm';
	import SignatureForm from './_partials/signatureForm.svelte';
	import PortalWrapper from '$lib/components/portalWrapper.svelte';
	import Drawer from '$lib/components/drawer.svelte';
	import { createToggleStore } from '$lib/components/utils/toggleStore';
	import { writable } from 'svelte/store';
	import IconButton from '$lib/components/iconButton.svelte';
	import _ from 'lodash';

	//

	export let data;
	$: folder = data.folder;

	//

	let hideFolderSettings: FieldsSettings<SignaturesResponse>['hide'];
	$: if (folder) {
		hideFolderSettings = { folder: folder.id };
	} else {
		hideFolderSettings = {};
	}

	// let shareModal = false;
	// let record: SignaturesResponse | undefined = undefined;

	// function openShareModal(r: SignaturesResponse) {
	// 	shareModal = true;
	// 	record = r;
	// }

	// function clearRecord() {
	// 	record = undefined;
	// }

	let show = false;
	let content: string | undefined = undefined;
	const duration = 2000;

	// function trigger(key: ToastContent) {
	// 	show = true;
	// 	content = toasts[key];
	// 	setTimeout(() => {
	// 		show = false;
	// 		content = undefined;
	// 	}, duration);
	// }

	//

	const signatureTypeProp =
		createTypeProp<SignaturesResponse<unknown, { folder: FoldersResponse }>>();
	const folderTypeProp = createTypeProp<FoldersResponse>();

	//

	const hideSignatureModal = createToggleStore(true);

	const type = writable<SignaturesTypeOptions | undefined>(undefined);
	function setType(type: SignaturesTypeOptions | undefined) {
		$type = type;
	}

	const signatureToEdit = writable<Omit<SignaturesResponse, 'signed_file'> | undefined>(undefined);
	function setSignatureToEdit(record: SignaturesResponse) {
		$signatureToEdit = _.omit(record, ['signed_file']);
	}
</script>

<PageTop>
	<SectionTitle title="Signatures" description="signatures_description" />
</PageTop>

<PageContent>
	{#if !folder}
		<PageCard>
			<CollectionManager
				recordType={folderTypeProp}
				formSettings={{
					hide: {
						owner: $currentUser?.id
					}
				}}
				collection={Collections.Folders}
				let:records
				hideEmptyState
			>
				<SectionTitle title="Folders">
					<svelte:fragment slot="right">
						<CreateRecord recordType={folderTypeProp}>Add folder</CreateRecord>
					</svelte:fragment>
				</SectionTitle>

				<svelte:fragment slot="emptyState">
					<CollectionEmptyState hideCreateButton></CollectionEmptyState>
				</svelte:fragment>

				{#if records.length}
					<div class="space-y-2">
						{#each records as record}
							<PlainCard let:Title class="py-2.5">
								<Title>
									<A href="/my/signatures?folder={record.id}">
										{record.name}
									</A>
								</Title>
								<svelte:fragment slot="right">
									<EditRecord {record} />
									<DeleteRecord {record} />
								</svelte:fragment>
							</PlainCard>
						{/each}
					</div>
				{/if}
			</CollectionManager>
		</PageCard>
	{/if}

	{#key hideFolderSettings}
		<PageCard>
			<CollectionManager
				recordType={signatureTypeProp}
				collection={Collections.Signatures}
				initialQueryParams={{
					expand: 'folder',
					filter: `folder.id = "${folder ? folder.id : ''}"`
				}}
				formSettings={{
					hide: {
						owner: $currentUser?.id,
						...hideFolderSettings
					},
					relations: {
						folder: { displayFields: ['name'], inputMode: 'select' },
						certificate: { displayFields: ['name'], inputMode: 'select' }
					},
					exclude: ['signed_file']
				}}
				editFormSettings={{
					exclude: ['owner', 'type', 'file']
				}}
				subscribe={[Collections.Authorizations, Collections.Folders]}
				let:records
				hideEmptyState
			>
				<!-- Header -->
				{@const title = folder ? folder.name : 'Signatures'}
				<div class="space-y-4">
					{#if folder}
						<Button outline href="/my/signatures">
							<Icon src={ArrowLeft} ml />
							Back to all signatures
						</Button>
					{/if}

					<SectionTitle {title}>
						<svelte:fragment slot="right">
							<Button>
								<span class="capitalize">{m.add_signature()}</span>
								<Icon src={Plus} ml />
							</Button>
							<Dropdown class="min-w-40">
								{#each Object.values(SignaturesTypeOptions) as type}
									<DropdownItem
										on:click={() => {
											setType(type);
											hideSignatureModal.off();
										}}
									>
										<span class="capitalize">{type}</span>
									</DropdownItem>
								{/each}
							</Dropdown>
						</svelte:fragment>
					</SectionTitle>
				</div>

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
					<svelte:fragment slot="actions" let:record>
						<!-- <Button
							class="!p-2"
							size="xs"
							on:click={() => {
								openShareModal(record);
							}}
						>
							<Share size="12" class="mr-1" />{m.SHARE()}
						</Button> -->
						<IconButton
							icon={Pencil}
							size="sm"
							border
							on:click={() => {
								setSignatureToEdit(record);
								hideSignatureModal.off();
							}}
						/>
					</svelte:fragment>

					<svelte:fragment slot="emptyState">
						<CollectionEmptyState
							title={m.No_signatures_yet()}
							description={m.Start_by_signing_a_document()}
							hideCreateButton
						/>
					</svelte:fragment>
				</CollectionTable>
			</CollectionManager>

			<!-- {#key record}
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
					{/key} -->
		</PageCard>
	{/key}
</PageContent>

<Toast position="bottom-right" color="indigo" transition={slide} bind:open={show}>
	{content}
</Toast>

<PortalWrapper>
	{@const ownerId = $currentUser?.id ?? ''}
	{@const drawerTitle = $type ? `${$type} signature` : `Signature`}
	<Drawer
		title={drawerTitle}
		bind:hidden={$hideSignatureModal}
		placement="right"
		width="min-w-[70vw]"
		closeOnClickOutside={false}
	>
		<div class="p-8">
			{#if $type}
				<SignatureForm {ownerId} type={$type} onSubmit={hideSignatureModal.on} />
			{/if}
			{#if $signatureToEdit}
				<SignatureForm
					{ownerId}
					signatureId={$signatureToEdit.id}
					type={$signatureToEdit.type}
					onSubmit={hideSignatureModal.on}
					initialData={$signatureToEdit}
				/>
			{/if}
		</div>
	</Drawer>
</PortalWrapper>
