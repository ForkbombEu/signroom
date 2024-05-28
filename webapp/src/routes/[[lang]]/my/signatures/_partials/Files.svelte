<script lang="ts" context="module">
	export type SignedFile = {
		name: string;
		bytes: string;
		digestAlgorithm: string;
	};
</script>

<script lang="ts">
	import type { SignaturesResponse } from '$lib/pocketbase/types';
	import { A, Modal } from 'flowbite-svelte';
	import { DocumentArrowDown, Eye, LockClosed } from 'svelte-heros-v2';
	import { pb } from '$lib/pocketbase';
	import RenderSignedFile from './RenderSignedFile.svelte';
	import { m } from '$lib/i18n';

	export let record: SignaturesResponse;
	export let value: any;

	$: signedFile = record?.signed_file as SignedFile;
	let url = '';
	if (record) url = pb.files.getUrl(record, value);

	let open = false;
	const { type } = record;
	let file: Blob;
	let downloadUrl: string;

	$: {
		if (signedFile) {
			file = new Blob([JSON.stringify({ type, signedFile })], {
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

<div class="flex max-w-[400px] flex-col gap-4">
	<A class="gap-1" href={url} download={value} slot="beforeButtons">
		<span>
			<DocumentArrowDown size="20" />
		</span>
		<span class="truncate">{m.Original_file()}</span>
	</A>

	<A class="gap-1" slot="downloadButton" href={downloadUrl} download={downloadName}>
		<span>
			<LockClosed size="20" />
		</span>
		<span class="truncate">{m.Signed_file()}</span>
	</A>
	<A slot="showButton">
		<button on:click={handleOpen} class="flex items-center">
			<span>
				<Eye size="20" class="mr-1" />
			</span>
			<span class="truncate">{m.Preview()}</span>
		</button>
	</A>
</div>
<div class="fixed z-50">
	<Modal bind:open title={`${record.title} – ${m.Signed()}`} size="md">
		<div class="w-full">
			<RenderSignedFile {type} {signedFile} />
		</div>
	</Modal>
</div>
