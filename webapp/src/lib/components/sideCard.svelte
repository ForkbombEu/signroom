<script lang="ts">
	import { Heading } from 'flowbite-svelte';
	import Card from './card.svelte';

	export let title: string;
	export let description: string | undefined = undefined;
	export let image: string | undefined = undefined;
	export let imageAlt = '';
</script>

<Card class="p-6 w-[300px] shrink-0 space-y-7">
	<slot name="top" />

	{#if image}
		<img
			class="border border-gray-200 bg-gray-100 h-[120px] w-full object-cover rounded-lg overflow-hidden"
			src={image}
			alt={imageAlt}
		/>
	{/if}

	<div class="space-y-2">
		<Heading tag="h6">{title}</Heading>
		{#if description || $$slots.description}
			<slot name="description">
				<p>{description}</p>
			</slot>
		{/if}
	</div>

	<slot name="bottom" />
</Card>
