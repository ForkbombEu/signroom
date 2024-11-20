<script lang="ts">
	import T from './t.svelte';

	export let label: string | undefined = undefined;

	let className = '';
	export { className as class };
</script>

<div class="bg-primary-foreground pl-3 {className}">
	<slot>
		{#if label}
			<T tag="small">{label}</T>
		{/if}
	</slot>
</div>
