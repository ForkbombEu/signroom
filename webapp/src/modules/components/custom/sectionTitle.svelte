<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Separator from '@/components/ui/separator/separator.svelte';
	import T from './t.svelte';

	export let title: string;
	export let tag: ComponentProps<T>['tag'] = 'h4';
	export let description: string | undefined = undefined;
	export let hideLine = false;

	$: hasDescription = $$slots.description || description;
</script>

<div class="space-y-2">
	<div class="flex flex-wrap items-center justify-between gap-2">
		<div class="w-fit">
			<T {tag}>{title}</T>
		</div>
		<div class="flex flex-wrap justify-end gap-2">
			<slot name="right" />
		</div>
	</div>

	{#if !hideLine}
		<Separator />
	{/if}

	{#if hasDescription}
		<slot name="description">
			<T class="text-sm text-gray-500">{description}</T>
		</slot>
	{/if}
</div>
