<script lang="ts">
	import Card from './card.svelte';

	let className = '';
	export { className as class };
</script>

<Card class={`p-8 space-y-8 rounded-xl ${className}`}>
	<slot />
</Card>
