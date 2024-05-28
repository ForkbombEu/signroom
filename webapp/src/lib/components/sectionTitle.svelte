<script lang="ts">
	import clsx from 'clsx';
	import { Heading, Hr } from 'flowbite-svelte';
	import type { ComponentProps } from 'svelte';

	export let title: string;
	export let tag: ComponentProps<Heading>['tag'] = 'h4';
	export let description: string | undefined = undefined;
	export let hideLine = false;

	$: hasDescription = $$slots.description || description;

	$: headingClass = clsx('flex justify-between items-center', {
		'!mb-2': hasDescription || !hideLine
	});

	$: hrClass = clsx('!m-0', { '!mb-2': hasDescription });
</script>

<div>
	<div class={headingClass}>
		<div class="w-fit">
			<Heading {tag}>{title}</Heading>
		</div>
		<slot name="right" />
	</div>
	{#if !hideLine}
		<Hr {hrClass} />
	{/if}
	{#if hasDescription}
		<slot name="description">
			<p class="text-sm text-gray-500">{description}</p>
		</slot>
	{/if}
</div>
