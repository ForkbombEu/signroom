<script lang="ts">
	import { goto } from '$lib/i18n';
	import { CollectionManager, CollectionSearch, Pagination } from '$lib/collectionManager';
	import { pb } from '$lib/pocketbase/index.js';
	import { Collections, type OrganizationsResponse } from '$lib/pocketbase/types.js';
	import { createTypeProp } from '$lib/utils/typeProp';
	import clsx from 'clsx';
	import { Avatar, Button, Heading, P, Select, Span } from 'flowbite-svelte';
	import { HeroHeader, Section } from 'flowbite-svelte-blocks';
	import { m } from '$lib/i18n';

	//

	const recordType = createTypeProp<OrganizationsResponse>();
</script>

<Section>
	<HeroHeader
		h1Class="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white"
		pClass="max-w-2xl mb-6 font-light lg:mb-8 lg:text-3xl dark:text-gray-400"
	>
		<svelte:fragment slot="h1">
			{m.Join_multiple_trusted()}
			<Span
				gradient
				gradientClass="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-500"
				class="text-primary-700">{m.organizations()}</Span
			>{m._with_one_account_()}
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
							<div class="line-clamp-2 grow text-sm text-gray-400">
								{#if hasDescription}
									{@html org.description}
								{/if}
							</div>
						</div>
						<div class="shrink-0 self-start pl-8">
							<Button
								color="alternative"
								on:click={() => {
									goto(`/register?join=${org.id}`);
								}}
							>
								{m.Join()}
							</Button>
						</div>
					</div>
				{/each}
				<Pagination />
			</CollectionManager>
		</div>
	</div>
</Section>
