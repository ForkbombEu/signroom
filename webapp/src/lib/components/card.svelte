<script lang="ts">
	let className = '';
	export { className as class };
</script>

<div class={`p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-white ${className}`}>
	<slot />
</div>
