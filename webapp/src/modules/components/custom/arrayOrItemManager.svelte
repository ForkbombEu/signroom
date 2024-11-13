<script lang="ts" generics="T">
	import { Array as A } from 'effect';

	export let data: T | T[] | undefined = undefined;

	function removeItemFromArray(item: T) {
		if (!Array.isArray(data)) return;
		data = A.remove(data, data.indexOf(item));
	}

	function removeItem() {
		if (Array.isArray(data)) return;
		data = undefined;
	}

	function typeCast(data: unknown): T {
		return data as T;
	}
</script>

{#if Array.isArray(data)}
	{#each data as item (item)}
		<slot {item} removeItem={() => removeItemFromArray(item)} />
	{/each}
{:else if data}
	<slot item={typeCast(data)} {removeItem} />
{/if}
