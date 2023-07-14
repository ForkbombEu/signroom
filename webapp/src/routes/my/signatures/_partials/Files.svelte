<script lang="ts">
	import File from '$lib/schema/recordsManager/views/fieldsComponents/cells/file.svelte';
	import type { Record } from 'pocketbase';
	import type { SignaturesRecord } from '$lib/pocketbase-types';
	import { A } from 'flowbite-svelte';
	import { DocumentArrowDown, Eye, LockClosed } from 'svelte-heros-v2';
	import SignedFileDisplay, { type SignedFile } from './SignedFileDisplay.svelte';

	export let record: Record & SignaturesRecord;
	export let value: any;
	value;
	const signed_file = record?.signed_file as SignedFile;
</script>

<div class="flex flex-col gap-4 max-w-[400px]">
	<File {record} value={record?.file || ''} let:url let:value>
		<A class="gap-1" href={url} download={value}>
			<span>
				<DocumentArrowDown size="20" />
			</span>
			<span class="truncate">Original file</span>
		</A>
	</File>
	<SignedFileDisplay {record} value={signed_file}>
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
