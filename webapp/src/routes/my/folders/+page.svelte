<script lang="ts">
	import { currentUser } from '$lib/pocketbase';
	import { Collections, type FoldersRecord, type SignaturesRecord } from '$lib/pocketbase-types';
	import RecordsManager from '$lib/schema/recordsManager/recordsManager.svelte';
	import RecordsManagerTopbar from '$lib/schema/recordsManager/recordsManagerTopbar.svelte';
	import RecordCard from '$lib/schema/recordsManager/views/recordCard.svelte';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { Heading } from 'flowbite-svelte';

	const expandQuery = 'signatures(folder)';

	const recordType = createTypeProp<
		FoldersRecord & { expand: { [expandQuery]: SignaturesRecord[] } }
	>();
</script>

<div class="p-4">
	<RecordsManager
		collection={Collections.Folders}
		formSettings={{
			hide: {'owner':$currentUser?.id},
		}}
		{recordType}
		initialQueryParams={{ expand: expandQuery }}
		let:records
		subscribe={[Collections.Signatures]}
	>
		<RecordsManagerTopbar>
			<svelte:fragment slot="title">
				<Heading tag="h4">My folders</Heading>
			</svelte:fragment>
		</RecordsManagerTopbar>
		<div class="space-y-4">
			<div class="gap-4 grid grid-cols-1 md:grid-cols-2">
				{#each records as record}
					{@const expand = record.expand[expandQuery]}
					<div class="grow">
						<RecordCard {record} titleField="name" showEdit showDelete>
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
	</RecordsManager>
</div>
