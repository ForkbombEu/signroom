<script lang="ts" generics="T">
	import { ArrowRight } from 'svelte-heros-v2';

	import Icon from '$lib/components/icon.svelte';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import { m } from '$lib/i18n';
	import { Button } from 'flowbite-svelte';
	import EmptyState from '$lib/components/emptyState.svelte';

	export let title: string;
	export let items: T[] = [];
	export let buttonHref: string | undefined = undefined;

	export let singleItemText: () => string;
	export let noItemsText: () => string;

	type I18nMessageWithParams<T extends Record<string, unknown>> = (params: T) => string;
	export let multipleItemsText: I18nMessageWithParams<{ number: string | number }>;
</script>

<SectionTitle {title}></SectionTitle>

<div class="flex justify-between items-center">
	<p class="text-primary-700 font-semibold">
		{#if items.length == 1}
			{singleItemText()}
		{:else if items.length > 1}
			{multipleItemsText({ number: items.length })}
		{:else if items.length === 0}
			{noItemsText()}
		{/if}
	</p>

	{#if buttonHref}
		<Button href={buttonHref} outline size="sm">
			{m.See_all()}
			<Icon src={ArrowRight} ml />
		</Button>
	{/if}
</div>

{#if items.length > 0}
	<div class="border rounded-lg bg-gray-50 p-3">
		<ul class=" divide-y h-[150px] overflow-auto">
			{#each items as item}
				<li class="py-2 px-1">
					<slot {item} />
				</li>
			{/each}
		</ul>
	</div>
{:else if items.length === 0 && noItemsText}
	<EmptyState title={noItemsText()}></EmptyState>
{/if}
