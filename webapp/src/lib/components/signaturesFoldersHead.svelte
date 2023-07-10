<script lang="ts">
	import { ArrowLeft, ClipboardDocumentCheck, Folder } from 'svelte-heros-v2';
	import { getRecordsManagerContext } from '$lib/schema/recordsManager/recordsManager.svelte';
	import { pb } from '$lib/pocketbase';
	import { Collections, type FoldersRecord } from '$lib/pocketbase-types';

	import CreateRecord from '$lib/schema/recordsManager/recordActions/createRecord.svelte';
	import {
		ArrowKeyDown,
		Button,
		Dropdown,
		DropdownItem,
		Heading,
		Spinner,
		A
	} from 'flowbite-svelte';
	import TitleDescription from './titleDescription.svelte';
	import type { Record } from 'pocketbase';

	//

	export let folderId: string;

	let folderPromise = loadFolder();

	async function loadFolder() {
		return await pb.collection(Collections.Folders).getOne<FoldersRecord & Record>(folderId);
	}

	const { formSettings } = getRecordsManagerContext();
	const createRecord = (type: String, cb: () => void) => {
		formSettings.hiddenFieldsValues!.type = type;
		console.log(formSettings, 'formSettings');
		cb();
	};
</script>

{#await folderPromise}
	<Spinner />
{:then folder}
	<div class="flex flex-row justify-between items-center mb-8">
		<div>
			<A href="/my/folders"><ArrowLeft size="20" /> <span class="ml-2">Back to folders</span></A>
			<div class="flex items-center gap-4">
				<Folder size="64" />
				<Heading tag="h3">{folder.name}</Heading>
			</div>
		</div>
		<CreateRecord let:openModal initialData={{ folder: folderId }}>
			<Button
				id="new-signature"
				color="primary"
				size="sm"
				class="!px-4 !py-2 whitespace-nowrap gap-2 w-fit"
			>
				<ArrowKeyDown />
				New signature
			</Button>
			<Dropdown class="w-text-sm font-light" title="Popover title" triggeredBy="#new-signature">
				<DropdownItem>
					<Button
						outline
						size="sm"
						class="!px-4 !py-2 whitespace-nowrap gap-2 w-fit"
						on:click={createRecord.bind(null, 'pdf', openModal)}
					>
						<ClipboardDocumentCheck />
						Sign PDF file
					</Button>
				</DropdownItem>
				<DropdownItem>
					<Button
						outline
						size="sm"
						class="!px-4 !py-2 whitespace-nowrap gap-2 w-fit"
						on:click={createRecord.bind(null, 'json', openModal)}
					>
						<ClipboardDocumentCheck />
						Sign JSON file
					</Button>
				</DropdownItem>
				<DropdownItem>
					<Button
						outline
						size="sm"
						class="!px-4 !py-2 whitespace-nowrap gap-2 w-fit"
						on:click={createRecord.bind(null, 'xml', openModal)}
					>
						<ClipboardDocumentCheck />
						Sign XML file
					</Button>
				</DropdownItem>
			</Dropdown>
		</CreateRecord>
	</div>
{/await}
