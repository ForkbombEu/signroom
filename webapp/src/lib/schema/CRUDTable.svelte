<script lang="ts" context="module">
	import type { Record as PBRecord } from 'pocketbase';
	import type { SvelteComponent, SvelteComponentTyped } from 'svelte';

	export type TableAction = {
		name: string;
		icon?: typeof SvelteComponent;
		function: <T>(record: T & PBRecord) => void;
	};

	export type TableCellComponent = typeof SvelteComponentTyped<{ value?: any }>;
</script>

<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import type { RecordFullListQueryParams } from 'pocketbase';
	import type { Collections } from '$lib/pocketbase-types';
	import {
		Button,
		Heading,
		Modal,
		P,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Checkbox
	} from 'flowbite-svelte';
	import CrudForm, {
		formMode,
		type FormMode,
		type RelationsDisplayFields
	} from './CRUDForm.svelte';
	import CrudTableHead from './CRUDTableHead.svelte';
	import { Trash, Pencil, Plus, XMark } from 'svelte-heros-v2';
	import CrudTableRow from './CRUDTableRow.svelte';
	import TitleDescription from '$lib/components/titleDescription.svelte';

	//

	export let title: string | null = null;
	export let description: string | null = null;
	export let createButtonLabel: string = 'Add entry';
	export let collection: Collections;
	export let fields: string[] = [];
	export let fieldsDisplay: Record<string, TableCellComponent> = {};
	export let showDelete = true;
	export let showEdit = true;
	export let actions: Array<TableAction> = [];
	export let relationsDisplayFields: RelationsDisplayFields = {};
	export let checkBoxes = true;

	export let formHiddenFields: string[] = [];
	export let formHiddenFieldsValues: Record<string, unknown> = {};

	//

	const recordService = pb.collection(collection);

	let data: PBRecord[];
	let queryParams: RecordFullListQueryParams = {
		$autoCancel: false,
		sort: '-created'
	};

	async function loadData() {
		data = await recordService.getFullList(queryParams);
	}

	$: {
		queryParams;
		loadData();
	}

	/* Record actions */

	type Action = 'delete' | FormMode;

	let currentRecord: PBRecord | null = null;
	let currentAction: Action | null = null;

	async function setAction(action: Action, record: PBRecord | null = null) {
		currentAction = action;
		currentRecord = record;
	}

	function resetState() {
		currentRecord = null;
		currentAction = null;
	}

	async function deleteRecord() {
		if (currentRecord && currentAction === 'delete') {
			await recordService.delete(currentRecord.id);
			loadData();
			resetState();
		}
	}

	async function handleSuccess() {
		loadData();
		resetState();
	}

	/* Multiple selection */

	let selection: string[] = [];
	let allSelected = false;

	$: if (data) {
		allSelected = data.length === selection.length;
	}

	function toggleAll() {
		if (allSelected) {
			selection = [];
		} else {
			if (data) {
				selection = data.map((item) => item.id);
			}
		}
	}

	function discardSelection() {
		selection = [];
	}

	async function deleteSelection() {
		if (selection.length && currentAction === 'delete') {
			for (const id of selection) {
				await recordService.delete(id);
			}
			loadData();
			discardSelection();
			resetState();
		}
	}
</script>

<div>
	<div class="flex justify-between items-center mb-4">
		<div class="max-w-sm">
			<TitleDescription title={title || collection} {description} />
			{#if description}
				<P>{description}</P>
			{/if}
		</div>
		<div class="shrink-0 flex space-x-4 items-center">
			{#if Boolean(selection.length)}
				<P><span class="font-bold">{selection.length}</span> selected</P>
				<div class="flex space-x-2 items-center">
					<Button color="alternative" on:click={discardSelection}>
						<XMark size="20" />
						<span class="ml-1">Discard</span>
					</Button>
					<Button
						color="alternative"
						on:click={() => {
							setAction('delete');
						}}
					>
						<Trash size="20" />
						<span class="ml-1"> Delete </span>
					</Button>
				</div>
			{:else}
				<Button
					color="primary"
					on:click={() => {
						setAction(formMode.CREATE);
					}}
				>
					<Plus size="20" />
					<span class="ml-1"> {createButtonLabel} </span>
				</Button>
			{/if}
		</div>
	</div>
	<Table>
		<TableHead>
			{#if checkBoxes}
				<TableHeadCell><Checkbox checked={allSelected} on:click={toggleAll} /></TableHeadCell>
			{/if}
			{#each fields as field}
				<CrudTableHead bind:queryParams {field} />
			{/each}
			{#if showEdit || showDelete}
				<TableHeadCell />
			{/if}
		</TableHead>
		<TableBody>
			{#if data}
				{#each data as item (item.id)}
					<CrudTableRow record={item} {collection}>
						{#if checkBoxes}
							<TableBodyCell>
								<Checkbox bind:group={selection} value={item.id} name="select" />
							</TableBodyCell>
						{/if}
						{#each fields as field}
							<TableBodyCell>
								{@const component = fieldsDisplay[field]}
								{#if component}
									<svelte:component this={component} value={item[field]} />
								{:else}
									{item[field]}
								{/if}
							</TableBodyCell>
						{/each}
						{#if showEdit || showDelete}
							<TableBodyCell class="justify-end">
								<div class="flex items-center justify-end space-x-2">
									<Button
										class="!p-2"
										pill
										outline
										color="alternative"
										on:click={() => {
											setAction(formMode.EDIT, item);
										}}
									>
										<Pencil size="20" color="red" />
										<span class="ml-1 text-red-500">Edit</span>
									</Button>
									<Button
										class="!p-2"
										pill
										outline
										color="alternative"
										on:click={() => {
											setAction('delete', item);
										}}
									>
										<Trash size="20" color="red" />
										<span class="ml-1 text-red-500">Delete</span>
									</Button>
									{#each actions as action}
										<Button
											class="!p-2"
											pill
											outline
											color="alternative"
											on:click={() => {
												action.function(item);
											}}
										>
											{#if action.icon}
												<svelte:component this={action.icon} color="red" />
											{/if}
											<span class="ml-1 text-red-500">
												{action.name}
											</span>
										</Button>
									{/each}
								</div>
							</TableBodyCell>
						{/if}
					</CrudTableRow>
				{/each}
			{/if}
		</TableBody>
	</Table>
</div>

{#if Boolean(currentRecord)}
	<Modal open={currentAction === 'delete'} title="Delete record" size="xs" on:hide={resetState}>
		<div class="text-center space-y-6">
			<P>Are you sure you want to delete this record?</P>
			<div class="flex gap-2 justify-center">
				<Button color="red" on:click={deleteRecord}>
					<Trash size="20" /><span class="ml-1">Delete</span>
				</Button>
				<Button color="alternative" on:click={resetState}>
					<XMark size="20" />
					<span class="ml-1"> Cancel </span>
				</Button>
			</div>
		</div>
	</Modal>
{/if}

{#if currentAction == formMode.EDIT || currentAction == formMode.CREATE}
	<Modal
		open={currentAction == formMode.EDIT || currentAction == formMode.CREATE}
		title="Edit record"
		size="lg"
		on:hide={resetState}
	>
		<div class="w-[500px]">
			<slot name="CRUDForm" {currentRecord}>
				<CrudForm
					mode={currentAction}
					{collection}
					on:success={handleSuccess}
					{relationsDisplayFields}
					hiddenFields={formHiddenFields}
					hiddenFieldsValues={formHiddenFieldsValues}
					initialData={currentRecord}
				/>
			</slot>
		</div>
	</Modal>
{/if}

{#if Boolean(selection.length)}
	<Modal open={currentAction === 'delete'} title="Delete record" size="xs" on:hide={resetState}>
		<div class="text-center space-y-6">
			<P>
				Are you sure you want to delete <span class="font-bold">{selection.length}</span> records?
			</P>
			<div class="flex gap-2 justify-center">
				<Button color="red" on:click={deleteSelection}>Delete</Button>
				<Button color="alternative" on:click={resetState}>Cancel</Button>
			</div>
		</div>
	</Modal>
{/if}
