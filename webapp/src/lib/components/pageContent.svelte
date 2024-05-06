<script lang="ts">
	let className = '';
	export { className as class };
</script>

<div class={`px-10 py-8 space-y-8 ${className}`}>
	<slot />
</div>
