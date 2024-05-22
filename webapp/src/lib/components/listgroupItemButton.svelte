<script lang="ts">
	import { ListgroupItem } from 'flowbite-svelte';
	import IconButton from './iconButton.svelte';
	// import { Eye } from 'svelte-heros-v2';
	import { createEventDispatcher } from 'svelte';

	// export let hideRemove = false;
	// export let hideShow = false;

	const dispatch = createEventDispatcher<{ remove: {} }>();

	const onRemove = () => {
		dispatch('remove', {});
	};

	// const onShow = () => {
	// 	dispatch('show');
	// };
</script>

<ListgroupItem>
	<div class="flex justify-between items-center">
		<slot />
		<div>
			<!-- {#if !hideShow}
				<IconButton icon={Eye} on:click={onShow} />
			{/if} -->
			<!-- {#if !hideRemove} -->
			<IconButton on:click={onRemove} />
			<!-- {/if} -->
		</div>
	</div>
</ListgroupItem>
