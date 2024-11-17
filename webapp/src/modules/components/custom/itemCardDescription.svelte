<script lang="ts">
	import T from '@/components/custom/t.svelte';

	let className = '';
	export { className as class };
</script>

<T class="text-card-foreground text-sm {className}"><slot /></T>
