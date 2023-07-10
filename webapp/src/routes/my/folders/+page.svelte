<script lang="ts">
	import { currentUser } from '$lib/pocketbase';
	import {
		Collections,
		type CrudExampleRecord,
		type FoldersRecord,
		type SignaturesRecord
	} from '$lib/pocketbase-types';
	import RecordsManager, {
		createSlotTypeCaster
	} from '$lib/schema/recordsManager/recordsManager.svelte';
	import RecordsManagerTopbar from '$lib/schema/recordsManager/recordsManagerTopbar.svelte';
	import RecordCard from '$lib/schema/recordsManager/views/recordCard.svelte';
	import { Button, Heading, P } from 'flowbite-svelte';
	import { ListBullet } from 'svelte-heros-v2';


	const expandQuery = 'signatures(folder)';

	const slotTypeCaster = createSlotTypeCaster<
		FoldersRecord & { expand: { [expandQuery]: SignaturesRecord[] } }
	>();
</script>

<div class="p-4">
	<RecordsManager
		collection={Collections.Folders}
		formSettings={{
			hiddenFields: ['owner'],
			hiddenFieldsValues: { owner: $currentUser?.id }
		}}
		{slotTypeCaster}
		initialQueryParams={{ expand: expandQuery }}
		let:records
	>
		<RecordsManagerTopbar>
			<svelte:fragment slot="title">
				<Heading tag="h4">My folders</Heading>
			</svelte:fragment>
		</RecordsManagerTopbar>
		<div class="space-y-4">
			<div class="gap-4 grid grid-cols-2">
				{#each records as record}
					{@const expand = record.expand[expandQuery]}
					<div class="grow">
						<RecordCard {record} titleField="name" showEdit showCheckbox showDelete>
							<P color="gray" size="sm">
								{expand.length}
								{expand.length > 1 ? 'signatures' : 'signature'}
							</P>
							<svelte:fragment slot="actions">
								{#if expand.length}
									<Button
										class="!py-2 !px-3"
										color="alternative"
										href={`/my/signatures?folder=${record.id}`}
									>
										<ListBullet size="20" />
										<span class="ml-2"> View signatures </span>
									</Button>
								{/if}
							</svelte:fragment>
						</RecordCard>
					</div>
				{/each}
			</div>
		</div>
	</RecordsManager>
</div>
