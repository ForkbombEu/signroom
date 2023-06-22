<script lang="ts" generics="T">
	import { Button } from 'flowbite-svelte';
	import { XMark } from 'svelte-heros-v2';

	export let array: T[];

	function removeItem(item: T) {
		array = array.filter((i) => i !== item);
	}
</script>

{#if array.length > 0}
	<div class="divide-y divide-gray-200 border border-gray-200 rounded-lg">
		{#each array as item (item)}
			<div class="p-1 pl-4 flex justify-between items-center text-sm">
				<slot {item} />
				<Button
					class="!p-1 !border-transparent"
					color="alternative"
					on:click={() => removeItem(item)}
				>
					<XMark size="20" />
				</Button>
			</div>
		{/each}
	</div>
{/if}
