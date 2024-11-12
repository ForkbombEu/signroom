<script lang="ts">
	import { FolderOpen } from 'lucide-svelte';
	import type { IconComponent } from '@/components/types';
	import Icon from '@/components/custom/icon.svelte';
	import T from './t.svelte';

	export let title: string;
	export let description: string | undefined = undefined;
	export let icon: IconComponent = FolderOpen;
</script>

<div
	class="text-primary/40 flex flex-col items-center justify-center rounded-lg border p-10 text-center"
>
	<div class="mb-6 opacity-50">
		<Icon src={icon} size={70} />
	</div>

	{#if title}
		<T tag="h4">
			{title}
		</T>
	{/if}

	{#if description}
		<T>{description}</T>
	{/if}

	<slot name="bottom" />
</div>
