<script lang="ts">
	import Card from '@/components/custom/card.svelte';

	let className = '';
	export { className as class };

	export let contentClass = '';
</script>

<Card class="shadow-md ${className}" contentClass="space-y-6 {contentClass}">
	<slot />
</Card>
