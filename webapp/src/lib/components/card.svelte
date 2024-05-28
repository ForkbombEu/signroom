<script lang="ts">
	let className = '';
	export { className as class };
</script>

<div class={`rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 dark:text-white ${className}`}>
	<slot />
</div>
