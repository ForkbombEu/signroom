<script lang="ts">
	let className = '';
	export { className as class };
</script>

<div class="rounded-md border px-4 py-3 text-sm {className}">
	<slot />
</div>
