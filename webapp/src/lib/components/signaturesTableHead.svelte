<script lang="ts">
	import CreateRecord from '$lib/schema/recordsManager/recordActions/createRecord.svelte';
	import { ArrowKeyDown, Button, Dropdown, DropdownItem } from 'flowbite-svelte';

	import TitleDescription from './titleDescription.svelte';
	import { ClipboardDocumentCheck } from 'svelte-heros-v2';
	import { getRecordsManagerContext } from '$lib/schema/recordsManager/recordsManager.svelte';
	const { formSettings } = getRecordsManagerContext();
	const createRecord = (type: String, cb: () => void) => {
		formSettings.hiddenFieldsValues!.type = type;
		console.log(formSettings, 'formSettings');
		cb();
	};
</script>

<div class="flex flex-row justify-between items-center mb-8">
	<TitleDescription title="My signatures" description="Here you can see all your signatures" />
	<div class="ml-4">
		<CreateRecord let:openModal>
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
</div>
