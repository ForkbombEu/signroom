<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import PageCard from './pageCard.svelte';
	import SectionTitle from './sectionTitle.svelte';

	export let title: string;
	export let description: string | undefined = undefined;
	export let image: string | undefined = undefined;
	export let imageAlt = '';
</script>

<PageCard class="min-w-[350px] max-w-[350px] shrink-0 !space-y-6 !p-5">
	<slot name="top" />

	{#if image}
		<img
			class="h-[150px] w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100 object-cover"
			src={image}
			alt={imageAlt}
		/>
	{/if}

	<SectionTitle tag="h6" {title} {description} hideLine></SectionTitle>

	<slot name="bottom" />
</PageCard>
