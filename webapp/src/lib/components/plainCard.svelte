<script lang="ts">
	import Title from './plainCardTitle.svelte';
	import Description from './plainCardDescription.svelte';
</script>

<div class="p-5 flex items-center justify-between border rounded-lg">
	<div>
		<slot {Title} {Description} />
	</div>
	<div>
		<slot name="right" />
	</div>
</div>
