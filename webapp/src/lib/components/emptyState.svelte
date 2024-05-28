<script lang="ts">
	import { FolderOpen } from 'svelte-heros-v2';
	import type { IconComponent } from '$lib/utils/types';
	import Icon from './icon.svelte';

	export let title: string;
	export let description: string | undefined = undefined;
	export let icon: IconComponent = FolderOpen;
</script>

<div class="flex flex-col items-center justify-center rounded-lg border p-10 text-center">
	<div class="text-gray-400">
		<Icon src={icon} size={40} />
	</div>

	<slot name="title">
		<p class="font-semibold text-gray-400">
			{title}
		</p>
	</slot>

	<slot name="description">
		{#if description}
			<p class=" w-fit text-sm font-medium text-gray-400">{description}</p>
		{/if}
	</slot>

	<slot name="bottom" />
</div>
