<script lang="ts">
	import CopyButton from './copyButton.svelte';

	export let rows: { title: string; value: string }[];
</script>

<div class="flex flex-col">
	{#each rows as row}
		<div class="text-md max-w-sm font-semibold text-black">{row.title}</div>
		<div class="text-md mb-4 flex flex-row items-center justify-between border-t font-bold">
			<div class="w-full overflow-hidden text-ellipsis">{row.value}</div>
			<CopyButton textToCopy={row.value} />
		</div>
	{/each}
</div>
