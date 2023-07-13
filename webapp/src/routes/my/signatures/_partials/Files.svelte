<script lang="ts">
	import File from '$lib/schema/recordsManager/views/fieldsComponents/cells/file.svelte';
	import type { Record } from 'pocketbase';
	import type { SignaturesRecord } from '$lib/pocketbase-types';
	import { Button, ButtonGroup, Tooltip } from 'flowbite-svelte';
	import {
		DocumentArrowDown,
		Eye,
		LockClosed,
	} from 'svelte-heros-v2';
	import SignedFileDisplay from './SignedFileDisplay.svelte';

	export let record: Record & SignaturesRecord;
	export let value: any;
	value;
</script>

<div class="flex flex-col gap-1 md:hidden">
	<File {record} value={record?.file || ''} let:url let:value>
		<Button
			class="inline-flex items-center gap-2 w-full"
			color="alternative"
			href={url}
			download={value}
		>
			<DocumentArrowDown size="20" />file
		</Button>
		<Tooltip>{value}</Tooltip>
	</File>
	<SignedFileDisplay {record} value={record?.signed_file}>
		<div slot="downloadButton" let:downloadUrl let:downloadName>
			<Button
				class="inline-flex items-center gap-2 w-full"
				color="alternative"
				href={downloadUrl}
				download={downloadName}
			>
				<LockClosed size="20" />signature
			</Button>
			<Tooltip>{downloadName}</Tooltip>
		</div>
		<div slot="showButton" let:handleOpen>
			<Button
				class="inline-flex items-center gap-2 w-full"
				color="alternative"
				on:click={handleOpen}
			>
				<Eye size="20" />view
			</Button>
		</div>
	</SignedFileDisplay>
</div>
<ButtonGroup class="hidden md:inline-flex">
	<File {record} value={record?.file || ''} let:url let:value>
		<Button
			class="inline-flex items-center gap-2 w-full"
			color="alternative"
			href={url}
			download={value}
		>
			<DocumentArrowDown size="20" />file
		</Button>
		<Tooltip>{value}</Tooltip>
	</File>
	<SignedFileDisplay {record} value={record?.signed_file}>
		<div slot="downloadButton" let:downloadUrl let:downloadName>
			<Button
				class="inline-flex items-center gap-2 w-full"
				color="alternative"
				href={downloadUrl}
				download={downloadName}
			>
				<LockClosed size="20" />signature
			</Button>
			<Tooltip>{downloadName}</Tooltip>
		</div>
		<div slot="showButton" let:handleOpen>
			<Button
				class="inline-flex items-center gap-2 w-full"
				color="alternative"
				on:click={handleOpen}
			>
				<Eye size="20" />view
			</Button>
		</div>
	</SignedFileDisplay>
</ButtonGroup>
