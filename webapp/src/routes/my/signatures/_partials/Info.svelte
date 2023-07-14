<script lang="ts">
	import type { Record } from 'pocketbase';
	import type { SignaturesRecord } from '$lib/pocketbase-types';
	import { Heading, P } from 'flowbite-svelte';
	import OwnerDisplay from './OwnerDisplay.svelte';
	import Chip from '$lib/schema/recordsManager/views/fieldsComponents/cells/chip.svelte';
	import FolderDisplay from './FolderDisplay.svelte';
	import { currentUser } from '$lib/pocketbase';

	export let value: any;
	export let record: Record & SignaturesRecord;
	value;

	const isOwned = $currentUser?.id === record?.owner;
</script>

<div class="flex flex-col gap-2 max-w-xl">
	<div>
		<div class="flex flex-row gap-4 items-center">
			{#if record?.type}
				<Chip value={record?.type} {record} />
			{/if}
			<OwnerDisplay value={record?.owner || ''} {record} />
			
		</div>
		<Heading tag="h5">
			{record?.title}
		</Heading>
		{#if record?.folder && isOwned}
				<FolderDisplay folderId={record?.folder} />
			{/if}
	</div>
	<div class="line-clamp-3 w-full whitespace-normal text-gray-600">
		{record?.description}
	</div>
</div>
