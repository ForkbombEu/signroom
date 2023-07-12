<script lang="ts">
	import { Listgroup } from 'flowbite-svelte';
	import ListgroupItemButton from './listgroupItemButton.svelte';

	type T = $$Generic;
	export let value: T | T[] | undefined;

	let tempItems: T[] = [];
	$: {
		if (Array.isArray(value)) tempItems = value;
		else if (value) tempItems = [value];
		else tempItems = [];
	}

	function removeItem(item: T) {
		if (Array.isArray(value)) value = value.filter((i) => i !== item);
		else value = undefined;
	}
</script>

{#if tempItems.length > 0}
	<Listgroup>
		{#each tempItems as item (item)}
			<ListgroupItemButton on:click={() => removeItem(item)}>
				<slot {item} />
			</ListgroupItemButton>
		{/each}
	</Listgroup>
{/if}
