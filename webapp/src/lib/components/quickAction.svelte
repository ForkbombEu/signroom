<script lang="ts">
	export let title: string;
	export let content: string | undefined = undefined;
</script>

<div class="rounded-lg border border-gray-300 p-4">
	<h5 class="text-lg font-medium text-primary-600">{title}</h5>
	{#if content || $$slots.default}
		<slot>
			<p>{content}</p>
		</slot>
	{/if}
</div>
