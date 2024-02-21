<script lang="ts">
	import { goto } from '$app/navigation';
	import { CollectionManager, CollectionSearch, Pagination } from '$lib/collectionManager';
	import { pb } from '$lib/pocketbase/index.js';
	import { Collections, type OrganizationsResponse } from '$lib/pocketbase/types.js';
	import { createTypeProp } from '$lib/utils/typeProp';
	import clsx from 'clsx';
	import { Avatar, Button, Heading, P, Select, Span } from 'flowbite-svelte';
	import { HeroHeader, Section } from 'flowbite-svelte-blocks';

	//

	const recordType = createTypeProp<OrganizationsResponse>();
</script>

<Section>
	<HeroHeader
		h1Class="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white"
		pClass="max-w-2xl mb-6 font-light lg:mb-8 lg:text-3xl dark:text-gray-400"
	>
		<svelte:fragment slot="h1">
			Join multiple trusted
			<Span
				gradient
				gradientClass="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-500"
				class="text-primary-700">organizations</Span
			>, with one account.
		</svelte:fragment>
	</HeroHeader>
</Section>

<Section>
	<div class="space-y-8">
		<div class="space-y-6">
			<CollectionManager
				{recordType}
				collection={Collections.Organizations}
				initialQueryParams={{}}
				let:records
			>
				<CollectionSearch
					{recordType}
					placeholder={'Search for organizations...'}
					searchableFields={['name']}
				/>
				{#each records as org}
					{@const avatarUrl = org.avatar ? pb.files.getUrl(org, org.avatar) : undefined}
					{@const hasDescription = Boolean(org.description)}
					{@const containerClass = clsx('flex space-x-4', { 'items-center': !hasDescription })}
					<div class={containerClass}>
						<Avatar src={avatarUrl} size="md" class="shrink-0" />
						<div class="grow">
							<P weight="bold">{org.name}</P>
							<div class="text-gray-400 text-sm line-clamp-2 grow">
								{#if hasDescription}
									{@html org.description}
								{/if}
							</div>
						</div>
						<div class="pl-8 shrink-0 self-start">
							<Button
								color="alternative"
								on:click={() => {
									goto(`/register?join=${org.id}`);
								}}
							>
								Join
							</Button>
						</div>
					</div>
				{/each}
				<Pagination />
			</CollectionManager>
		</div>
	</div>
</Section>
