<script lang="ts">
	import { FolderOpen } from 'svelte-heros-v2';
	import type { IconComponent } from '$lib/utils/types';
	import Icon from './icon.svelte';

	export let title: string;
	export let description: string | undefined = undefined;
	export let icon: IconComponent = FolderOpen;
</script>

<div class="p-10 text-center border rounded-lg flex flex-col items-center justify-center">
	<div class="text-gray-400">
		<Icon src={icon} size={40} />
	</div>

	<slot name="title">
		<p class="text-gray-400 font-semibold">
			{title}
		</p>
	</slot>

	<slot name="description">
		{#if description}
			<p class=" text-sm w-fit text-gray-400 font-medium">{description}</p>
		{/if}
	</slot>

	<slot name="bottom" />
</div>
