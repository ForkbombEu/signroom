<script lang="ts" context="module">
	type MaybePromise<T> = T | Promise<T>;

	export type RejectedFile = { file: File; reasons: string[] };
	export type FileManagerValidator = (
		newFiles: File[]
	) => MaybePromise<{ acceptedFiles: File[]; rejectedFiles: RejectedFile[] }>;
</script>

<script lang="ts">
	import ArrayOrItemManager from './arrayOrItemManager.svelte';
	import Button from '@/components/ui/button/button.svelte';
	import T from './t.svelte';
	import { X } from 'lucide-svelte';
	import Icon from './icon.svelte';
	import _ from 'lodash';
	import Badge from '@/components/ui/badge/badge.svelte';
	import { m } from '@/i18n';
	import List from './list.svelte';
	import ListHeader from './listHeader.svelte';
	import ListItem from './listItem.svelte';

	//

	export let data: File | File[] | undefined = undefined;
	export let validator: FileManagerValidator | undefined = undefined;
	export let multiple = false;

	/* File upload handling */

	let rejectedFiles: RejectedFile[] = [];

	async function addFiles(newFiles: File[]) {
		if (validator) {
			const result = await validator(newFiles);
			newFiles = result.acceptedFiles;
			rejectedFiles = result.rejectedFiles;
		}
		updateData(newFiles);
	}

	function updateData(newFiles: File[]) {
		if (multiple) {
			if (Array.isArray(data)) data = [...data, ...newFiles];
			else if (data === undefined) data = [...newFiles];
		} else {
			data = newFiles[0];
		}
	}

	function clearRejectedFiles() {
		rejectedFiles = [];
	}

	/* Checking if a file has been added after the component has been initalized */

	const oldFiles = data;

	function isNewFile(file: File): boolean {
		if (Array.isArray(oldFiles)) {
			const search = oldFiles.find((f) => _.isEqual(f, file));
			return !Boolean(search);
		} else {
			return !_.isEqual(oldFiles, file);
		}
	}
</script>

<div class="space-y-2">
	<slot {addFiles} />

	{#if (Array.isArray(data) && data.length > 0) || (!multiple && Boolean(data))}
		<List>
			<ListHeader label={m.Files()} />
			<ArrayOrItemManager bind:data let:item let:removeItem>
				{@const isNew = isNewFile(item)}
				<ListItem on:click={removeItem}>
					<slot name="file" file={item} {isNew}>
						<div class="flex items-center gap-2">
							<T tag="p">
								{item.name}
							</T>
							{#if isNew}
								<Badge variant="secondary">{m.New()}</Badge>
							{/if}
						</div>
					</slot>
				</ListItem>
			</ArrayOrItemManager>
		</List>
	{/if}

	{#if rejectedFiles.length > 0}
		<List>
			<ListHeader class="flex items-center justify-between">
				<T tag="small">{m.Rejected_files()}</T>
				<Button variant="link" class="h-6 text-xs" on:click={clearRejectedFiles}>
					<X size={14} class="mr-1" />
					{m.Clear()}
				</Button>
			</ListHeader>
			{#each rejectedFiles as rejection}
				<div class="px-3 py-1 leading-tight text-red-600">
					<T tag="small" class="!font-normal">{rejection.file.name}</T>
					<ul>
						{#each rejection.reasons as reason}
							<li>
								<T tag="small">{reason}</T>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</List>
	{/if}
</div>
