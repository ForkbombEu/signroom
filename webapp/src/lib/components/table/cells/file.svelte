<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { getRowContext } from '$lib/schema/CRUDTableRow.svelte';
	import { Button, Tooltip } from 'flowbite-svelte';
	import { ArrowDownTray } from 'svelte-heros-v2';

	export let value: string;

	const context = getRowContext();
	const url = pb.files.getUrl(context.record, value);
</script>

{#if value}
	<Button href={url} target="_blank" class="!p-2" color="alternative">
		<ArrowDownTray size="20" />
	</Button>
	<Tooltip>Download: {value}</Tooltip>
{/if}
