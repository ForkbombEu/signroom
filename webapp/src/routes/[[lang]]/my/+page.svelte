<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
	import TitleDescription from '$lib/components/titleDescription.svelte';
	import { pb } from '$lib/pocketbase';
	import { Card, Heading } from 'flowbite-svelte';
	import { BlogBodyWrapper, Section } from 'flowbite-svelte-blocks';
	import { ArrowTopRightOnSquare, ArrowLongRight } from 'svelte-heros';
	import { m } from '$lib/i18n';
	import GridSpinner from '$lib/components/gridSpinner.svelte';
	import PageCard from '$lib/components/pageCard.svelte';
	import PageContent from '$lib/components/pageContent.svelte';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	let news = pb.collection('posts').getFullList({ filter: 'published=true' });
	let links = pb.collection('quick_actions').getFullList({ filter: 'published=true' });
</script>

<PageContent layout="horizontal">
	<PageCard>
		<SectionTitle title={m.Quick_actions()} description={m.quick_actions_description()} />

		{#await links}
			<GridSpinner />
		{:then links}
			{#each links as link}
				<a
					href={link.href}
					class="group flex cursor-pointer items-center rounded-lg border-2 border-slate-400 p-3 hover:border-primary-500"
				>
					<div class="hidden text-primary-500 group-hover:block">
						<ArrowLongRight class="mr-2 inline-block w-6" />
					</div>
					<div>
						<Heading tag="h6" class="font-semibold text-primary-500">{link.title}</Heading>
						<p class="font-light text-gray-700 dark:text-gray-400">
							{link.description}
						</p>
					</div>
				</a>
			{/each}
		{/await}
	</PageCard>

	<PageCard>
		<SectionTitle title={m.news_section_title()} description={m.news_section_description()} />

		{#await news}
			<GridSpinner />
		{:then news}
			{#each news as n}
				<Card img={`${PUBLIC_POCKETBASE_URL}api/files/posts/${n.id}/${n.cover}?thumb=0x180`}>
					<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
						{n.title}
					</h5>
					<p class="mb-3 font-normal leading-tight text-gray-700 dark:text-gray-400">
						{n.preview}
					</p>
					<a
						href={`/news#${n.id}`}
						class="inline-flex items-center text-primary-600 hover:underline"
					>
						{m.Read_more()}
						<ArrowTopRightOnSquare class="ml-2 w-4" />
					</a>
				</Card>
			{/each}
		{/await}
	</PageCard>
</PageContent>
