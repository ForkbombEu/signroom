<script lang="ts">
	import { currentUser } from '$lib/pocketbase';
	import {
		Collections,
		type FoldersRecord,
		type FoldersResponse,
		type SignaturesRecord,
		type SignaturesResponse
	} from '$lib/pocketbase/types';
	import { CollectionManager, CollectionManagerHeader, RecordCard } from '$lib/collectionManager';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { Heading } from 'flowbite-svelte';

	const expandQuery = 'signatures(folder)';

	const recordType =
		createTypeProp<FoldersResponse<{ 'signatures(folder)': SignaturesResponse[] }>>();
</script>

<div class="p-4">
	<CollectionManager
		collection={Collections.Folders}
		formSettings={{
			hide: { owner: $currentUser?.id }
		}}
		{recordType}
		initialQueryParams={{ expand: expandQuery }}
		let:records
		subscribe={[Collections.Signatures]}
	>
		<CollectionManagerHeader>
			<svelte:fragment slot="title">
				<Heading tag="h4">My folders</Heading>
			</svelte:fragment>
		</CollectionManagerHeader>
		<div class="space-y-4">
			<div class="gap-4 grid grid-cols-1 md:grid-cols-2">
				{#each records as record}
					{@const expand = record.expand?.[expandQuery]}
					<div class="grow">
						<RecordCard {record} titleField="name" hideActions={['select']}>
							<div class="mb-3">
								<a class="text-primary-500 underline" href={`/my/signatures?folder=${record.id}`}>
									{#if expand}
										{expand.length}
										{expand.length > 1 ? 'signatures' : 'signature'}
									{:else}
										add signature
									{/if}
								</a>
							</div>
						</RecordCard>
					</div>
				{/each}
			</div>
		</div>
	</CollectionManager>
</div>
