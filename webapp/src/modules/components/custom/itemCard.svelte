<script lang="ts">
	import Title from './itemCardTitle.svelte';
	import Description from './itemCardDescription.svelte';

	let className = '';
	export { className as class };
</script>

<div class="flex items-center gap-4 rounded-lg border p-4 {className}">
	{#if $$slots.left}
		<div class="shrink-0">
			<slot name="left" />
		</div>
	{/if}

	<div class="w-0 grow overflow-hidden">
		<slot {Title} {Description} />
	</div>

	{#if $$slots.right}
		<div class="shrink-0">
			<slot name="right" />
		</div>
	{/if}
</div>
