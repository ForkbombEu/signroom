<!-- 
<script lang="ts">
	import { getCollectionManagerContext } from './collectionManager.svelte';
	import { Trash, X } from 'lucide-svelte';
	import { CreateRecord } from './actions';
	import PortalWrapper from '$lib/components/portalWrapper.svelte';
	import type { ComponentProps } from 'svelte';
	import T from '@/components/custom/t.svelte';
	import { Button } from '@/components/ui/button';
	import Icon from '@/components/custom/icon.svelte';
	import { m } from '@/i18n';
	import Dialog from '@/components/custom/dialog.svelte';

	//

	export let headingTag: ComponentProps<T>['tag'] = 'h4';
	export let showDeleteModal = false;
	export let description: string | null = null;
	export let hideCreateButton = false;

	const { collection, selectionManager, dataManager } = getCollectionManagerContext();
	const { recordService, loadRecords } = dataManager;
	const { selectedRecords, discardSelection } = selectionManager;

	async function deleteSelection() {
		if (!$selectedRecords.length) return;
		await Promise.all([...$selectedRecords.map((id) => recordService.delete(id))]);
		loadRecords();
		discardSelection();
	}
</script>

<div class="mb-4 flex items-center justify-between">
	<slot name="title">
		<T tag={headingTag}>{collection}</T>
	</slot>
	{#if description}
		<T class="pt-6 text-slate-600">{description}</T>
	{/if}
	<div class="flex shrink-0 items-center space-x-4">
		{#if $selectedRecords.length > 0}
			<T><span class="font-bold">{$selectedRecords.length}</span> selected</T>
			<div class="flex items-center space-x-2">
				<Button color="alternative" on:click={discardSelection}>
					<Icon src={X} mr />
					{m.Discard()}
				</Button>
				<Button
					variant="outline"
					on:click={() => {
						showDeleteModal = true;
					}}
				>
					<Trash size="20" />
					<span class="ml-1">Delete</span>
				</Button>
			</div>
		{:else}
			<div class="flex items-center gap-3">
				{#if !hideCreateButton}
					<CreateRecord />
				{/if}
				<slot name="actions" />
			</div>
		{/if}
	</div>
</div>

<PortalWrapper>
	<Dialog bind:open={showDeleteModal} title="Delete records">
		<div class="space-y-6 text-center">
			<T>
				Are you sure you want to delete <span class="font-bold">{$selectedRecords.length}</span> records?
			</T>
			<div class="flex justify-center gap-2">
				<Button color="red" on:click={deleteSelection}>Delete</Button>
				<Button
					color="alternative"
					on:click={() => {
						showDeleteModal = false;
					}}>Cancel</Button
				>
			</div>
		</div>
	</Dialog>
</PortalWrapper> -->
