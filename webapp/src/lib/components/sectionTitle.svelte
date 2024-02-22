<script lang="ts">
	import clsx from 'clsx';
	import { Heading, Hr } from 'flowbite-svelte';
	import type { ComponentProps } from 'svelte';

	export let title: string;
	export let tag: ComponentProps<Heading>['tag'] = 'h4';
	export let description: string | undefined = undefined;
	export let hideLine = false;

	$: hasDescription = $$slots.default || description;
	$: headingClass = clsx({ '!mb-4': hasDescription || !hideLine });
</script>

<div>
	<Heading {tag} class={headingClass}>{title}</Heading>
	{#if !hideLine}
		<Hr hrClass="!m-0 !mb-2" />
	{/if}
	{#if hasDescription}
		<p class="text-gray-500"><slot>{description}</slot></p>
	{/if}
</div>
