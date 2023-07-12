<script lang="ts">
	import File from '$lib/schema/recordsManager/views/fieldsComponents/cells/file.svelte';
	import type { Record } from 'pocketbase';
	import type { SignaturesRecord } from '$lib/pocketbase-types';
	import { Button, Tooltip } from 'flowbite-svelte';
	import { ArrowDownTray, DocumentCheck, PlayPause } from 'svelte-heros-v2';
	import SignedFileDisplay from './SignedFileDisplay.svelte';
	
    export let record: Record & SignaturesRecord;
    export let value: any;
    value;
</script>

<div class="flex flex-col gap-4">
	<File {record} value={record?.file || ''} let:url let:value>
		<Button class="inline-flex items-center gap-2 w-full" color="alternative" href={url} download={value}>
			<ArrowDownTray size="20" /><span> download original file </span>
		</Button>
		<Tooltip>{value}</Tooltip>
	</File>
	<SignedFileDisplay {record} value={record?.signed_file}>
		<div slot="downloadButton" let:downloadUrl let:downloadName>
			<Button class="inline-flex items-center gap-2 w-full" color="alternative" href={downloadUrl} download={downloadName}>
				<ArrowDownTray size="20" />download signed file
			</Button>
            <Tooltip>{downloadName}</Tooltip>
		</div>
		<div slot="showButton" let:handleOpen>
			<Button class="inline-flex items-center gap-2 w-full" color="alternative" on:click={handleOpen}>
				<DocumentCheck size="20" />
				<span>show signed file</span>
			</Button>
		</div>
	</SignedFileDisplay>
</div>
