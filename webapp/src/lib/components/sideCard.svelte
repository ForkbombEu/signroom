<script lang="ts">
	import PageCard from './pageCard.svelte';
	import SectionTitle from './sectionTitle.svelte';

	export let title: string;
	export let description: string | undefined = undefined;
	export let image: string | undefined = undefined;
	export let imageAlt = '';
</script>

<PageCard class="max-w-[350px] min-w-[350px] shrink-0 !p-5 !space-y-6">
	<slot name="top" />

	{#if image}
		<img
			class="border border-gray-200 bg-gray-100 h-[150px] w-full object-cover rounded-lg overflow-hidden"
			src={image}
			alt={imageAlt}
		/>
	{/if}

	<SectionTitle tag="h6" {title} {description} hideLine></SectionTitle>

	<slot name="bottom" />
</PageCard>
