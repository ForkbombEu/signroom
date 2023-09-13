<script lang="ts">
	import type { SignaturesRecord } from '$lib/pocketbase/types';
	import { A } from 'flowbite-svelte';
	import { DocumentArrowDown, Eye, LockClosed } from 'svelte-heros-v2';
	import SignedFileDisplay, { type SignedFile } from './SignedFileDisplay.svelte';
	import type { PBResponse } from '$lib/utils/types';
	import { pb } from '$lib/pocketbase';

	export let record: PBResponse<SignaturesRecord>;
	export let value: any;
	value;
	const signed_file = record?.signed_file as SignedFile;
	let url = '';
	if (record) url = pb.files.getUrl(record, value);
</script>

<div class="flex flex-col gap-4 max-w-[400px]">
	<SignedFileDisplay {record} value={signed_file}>
		<A class="gap-1" href={url} download={value} slot="beforeButtons">
			<span>
				<DocumentArrowDown size="20" />
			</span>
			<span class="truncate">Original file</span>
		</A>
		<A
			class="gap-1"
			slot="downloadButton"
			let:downloadUrl
			let:downloadName
			href={downloadUrl}
			download={downloadName}
		>
			<span>
				<LockClosed size="20" />
			</span>
			<span class="truncate">Signed file</span>
		</A>
		<A slot="showButton" let:handleOpen>
			<button on:click={handleOpen} class="flex items-center">
				<span>
					<Eye size="20" class="mr-1" />
				</span>
				<span class="truncate">Preview</span>
			</button>
		</A>
	</SignedFileDisplay>
</div>
