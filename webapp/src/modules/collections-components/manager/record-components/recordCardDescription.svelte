<script lang="ts">
	import T from '@/components/custom/t.svelte';

	let className = '';
	export { className as class };
</script>

<T class="text-primary/70 text-sm {className}"><slot /></T>
