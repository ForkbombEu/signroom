<script lang="ts">
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
	import TitleDescription from '$lib/components/titleDescription.svelte';
	import { pb } from '$lib/pocketbase';
	import { Card } from 'flowbite-svelte';
	import { BlogBodyWrapper, Section } from 'flowbite-svelte-blocks';
	import { ArrowTopRightOnSquare } from 'svelte-heros';
	let news = pb.collection('posts').getFullList({ filter: 'published=true' });
</script>

<!-- <TitleDescription
	title="Quick actions"
	description="Perform essential tasks efficiently and effortlessly, empowering you to sign, verify, and manage documents with ease."
/>
<div class="border rounded-lg shadow p-8" /> -->

<Section name="blog">
	<TitleDescription
		title="What's new"
		description="Stay up to date with the latest developments and insights in the world of cryptography and digital signatures."
	/>

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
</Section>
