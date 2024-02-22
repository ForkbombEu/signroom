<script lang="ts">
	export let title: string;
	export let content: string | undefined = undefined;
</script>

<div class="p-4 border border-gray-300 rounded-lg">
	<h5 class="text-primary-600 text-lg font-medium">{title}</h5>
	{#if content || $$slots.default}
		<slot>
			<p>{content}</p>
		</slot>
	{/if}
</div>
