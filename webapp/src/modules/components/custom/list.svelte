<script lang="ts">
	let className = '';
	export { className as class };
</script>

<div class="divide-y overflow-hidden rounded-md border {className}">
	<slot></slot>
</div>
