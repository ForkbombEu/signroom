<script lang="ts" context="module">
	export type SignedFile = {
		name: string;
		bytes: string;
		digestAlgorithm: string;
	};
</script>

<script lang="ts">
	import type { Record } from 'pocketbase';
	import type { SignaturesRecord } from '$lib/pocketbase-types';
	import { Button, Modal } from 'flowbite-svelte';
	import { DocumentArrowDown, DocumentCheck } from 'svelte-heros-v2';
	import RenderSignedFile from './RenderSignedFile.svelte.svelte';

	export let value: SignedFile;
	export let record: Record & SignaturesRecord;

	let open = false;
	const { type } = record;

	const onDownload = ()=> {
		const a = document.createElement('a');
		const file = new Blob([JSON.stringify({ type: record.type, signedFile: value })], { type: 'text/plain' });
		a.href = URL.createObjectURL(file);
		a.download = `${record.title}.json`
		a.click();
	}
</script>

<Button
	target="_blank"
	class="!p-2"
	color="alternative"
	on:click={onDownload}>
	 <DocumentArrowDown size="20" />
	</Button
>
<Button target="_blank" class="!p-2" color="alternative" on:click={() => (open = !open)}>
	<DocumentCheck size="20" />
</Button>
<div class="fixed z-50">
	<Modal bind:open title={`${record.title} – Signed`} size="lg">
		<div class="w-[600px]">
			<RenderSignedFile {type} signedFile={value} />
		</div>
	</Modal>
</div>
