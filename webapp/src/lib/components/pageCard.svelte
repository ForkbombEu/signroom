<script lang="ts">
	import Card from './card.svelte';

	let className = '';
	export { className as class };
</script>

<Card class={`p-8 space-y-8 ${className}`}>
	<slot />
</Card>
