<<<<<<< ours
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

<PageContent class="flex gap-8 items-start !space-y-0">
	<PageCard>
		<SectionTitle title={m.Quick_actions()} description={m.quick_actions_description()} />

		{#await links}
			<GridSpinner />
		{:then links}
			{#each links as link}
				<a
					href={link.href}
					class="rounded-lg border-2 border-slate-400 p-3 hover:border-primary-500 group flex items-center cursor-pointer"
				>
					<div class="hidden group-hover:block text-primary-500">
						<ArrowLongRight class="w-6 inline-block mr-2" />
					</div>
					<div>
						<Heading tag="h6" class="text-primary-500 font-semibold">{link.title}</Heading>
						<p class="text-gray-700 dark:text-gray-400 font-light">
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
					<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
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
=======
<script>
	import { A } from 'flowbite-svelte';
	import { featureFlags } from '$lib/features';
</script>

<div class="flex flex-col p-4">
	<A href="/my/profile">My profile</A>
	{#if $featureFlags.ORGANIZATIONS}
		<A href="/my/organizations">My organizations</A>
	{/if}
</div>
>>>>>>> theirs
