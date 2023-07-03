<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { Button, Tooltip } from 'flowbite-svelte';
	import type { Record } from 'pocketbase';
	import { ArrowDownTray } from 'svelte-heros-v2';

	type RecordGeneric = $$Generic;

	export let value: string;
	export let record: RecordGeneric & Record;

	let url = '';
	if (record) url = pb.files.getUrl(record, value);
</script>

{#if url}
	<Button href={url} target="_blank" class="!p-2" color="alternative">
		<ArrowDownTray size="20" />
	</Button>
	<Tooltip>Download: {value}</Tooltip>
{/if}
