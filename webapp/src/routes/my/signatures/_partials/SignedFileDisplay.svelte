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
	import RenderSignedFile from './RenderSignedFile.svelte';
	import type { PBResponse } from '$lib/utils/types';

	export let value: SignedFile;
	export let record: PBResponse<SignaturesRecord>;

	let open = false;
	const { type } = record;
	let file: Blob;
	let downloadUrl: string;

	$: {
		if (value) {
			file = new Blob([JSON.stringify({ type: record.type, signedFile: value })], {
				type: 'application/json'
			});
		}
		if (file) {
			downloadUrl = URL.createObjectURL(file);
		}
	}
	const downloadName = `${record.title}.json`;
	const handleOpen = () => (open = !open);
</script>
<slot name="beforeButtons"/>
<slot name="downloadButton" {downloadUrl} {downloadName}>
	<Button
		target="_blank"
		class="!p-2"
		color="alternative"
		href={downloadUrl}
		download={downloadName}
	>
		<DocumentArrowDown size="20" />
	</Button>
</slot>
<slot name="showButton" {handleOpen}>
	<Button target="_blank" class="!p-2" color="alternative" on:click={handleOpen}>
		<DocumentCheck size="20" />
	</Button>
</slot>
<div class="fixed z-50">
	<Modal bind:open title={`${record.title} – Signed`} size="lg">
		<div class="w-[300px] md:w-[600px]">
			<RenderSignedFile {type} signedFile={value} />
		</div>
	</Modal>
</div>
