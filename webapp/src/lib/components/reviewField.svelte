<script lang="ts">
	export let label: string | undefined = undefined;
</script>

<div class="space-y-1">
	{#if label}
		<p class="text-sm">{label}</p>
	{/if}

	<div class="px-3 py-2 rounded-lg bg-gray-100 text-gray-500">
		<slot />
	</div>
</div>
