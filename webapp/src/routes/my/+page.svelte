<script lang="ts">
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
	import TitleDescription from '$lib/components/titleDescription.svelte';
	import { pb } from '$lib/pocketbase';
	import { Heading, Card } from 'flowbite-svelte';
	import BackgroundCard from '$lib/components/card.svelte';
	import { BlogBodyWrapper, Section } from 'flowbite-svelte-blocks';
	import { ArrowTopRightOnSquare, ArrowLongRight } from 'svelte-heros';
	import SectionTitle from '$lib/components/sectionTitle.svelte';

	let news = pb.collection('posts').getFullList({ filter: 'published=true' });
	let links = pb.collection('quick_actions').getFullList({ filter: 'published=true' });
</script>

<div class="space-y-8">
	<BackgroundCard class="p-6">
		<SectionTitle title="Quick actions">
			Perform essential tasks efficiently and effortlessly, empowering you to sign, verify, and
			manage documents with ease.
		</SectionTitle>

		{#await links}
			<p>Loading...</p>
		{:then links}
			<div class="space-y-4 pt-6">
				{#each links as link}
					<!-- TODO - Port quick actions component here  -->
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
			</div>
		{/await}
	</BackgroundCard>

	<BackgroundCard class="p-6">
		<SectionTitle title="What's new">
			Stay up to date with the latest developments and insights in the world of cryptography and
			digital signatures.
		</SectionTitle>

		<BlogBodyWrapper divClass="grid gap-8 grid-cols-2 lg:grid-cols-2 py-10 ">
			{#await news}
				<p>loading...</p>
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
							Read more
							<ArrowTopRightOnSquare class="ml-2 w-4" />
						</a>
					</Card>
				{/each}
			{/await}
		</BlogBodyWrapper>
	</BackgroundCard>
</div>
