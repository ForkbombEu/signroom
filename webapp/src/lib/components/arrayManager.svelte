<script lang="ts">
	import { Button, Listgroup, ListgroupItem } from 'flowbite-svelte';
	import { XMark } from 'svelte-heros-v2';
	import IconButton from './iconButton.svelte';
	import ListgroupItemButton from './listgroupItemButton.svelte';

	type T = $$Generic;

	export let array: T[];

	function removeItem(item: T) {
		array = array.filter((i) => i !== item);
	}
</script>

{#if array.length > 0}
	<Listgroup>
		{#each array as item (item)}
			<ListgroupItemButton on:click={() => removeItem(item)}>
				<slot {item} />
			</ListgroupItemButton>
		{/each}
	</Listgroup>
{/if}
