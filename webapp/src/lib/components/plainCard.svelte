<script lang="ts">
	import Title from './plainCardTitle.svelte';
	import Description from './plainCardDescription.svelte';
</script>

<div class="p-5 flex items-center border rounded-lg gap-4">
	{#if $$slots.left}
		<div class="shrink-0">
			<slot name="left" />
		</div>
	{/if}

	<div class="grow">
		<slot {Title} {Description} />
	</div>

	{#if $$slots.right}
		<div class="shrink-0">
			<slot name="right" />
		</div>
	{/if}
</div>
