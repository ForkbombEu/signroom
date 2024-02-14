<script lang="ts">
	import type { SignaturesResponse } from '$lib/pocketbase/types';

	import { Heading } from 'flowbite-svelte';
	import OwnerDisplay from './OwnerDisplay.svelte';
	import Chip from './chip.svelte';
	import { currentUser } from '$lib/pocketbase';

	export let value: any;
	export let record: SignaturesResponse;
	value;

	//@ts-ignore
	let folder = record.expand?.folder?.name;
	const isOwned = $currentUser?.id === record?.owner;
</script>

<div class="flex flex-col gap-2 max-w-xl">
	<div>
		<div class="flex flex-row gap-4 items-center" />
		<Heading tag="h5">
			{record?.title}
			{#if record?.type}
				<Chip value={record?.type} {record} />
			{/if}
			<OwnerDisplay value={record?.owner || ''} {record} />
		</Heading>
		{#if folder && isOwned}
			<div class="text-gray-400 font-semibold">{folder}</div>
		{/if}
	</div>
	<div class="line-clamp-3 w-full whitespace-normal text-gray-600">
		{record?.description}
	</div>
</div>
