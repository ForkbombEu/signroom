<script lang="ts">
	import { ListgroupItem } from 'flowbite-svelte';
	import IconButton from './iconButton.svelte';
</script>

<ListgroupItem>
	<div class="flex justify-between items-center">
		<slot />
		<IconButton on:click />
	</div>
</ListgroupItem>
