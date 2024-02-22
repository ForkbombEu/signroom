<script lang="ts">
	import { Collections, type MultisignatureSealsResponse } from '$lib/pocketbase/types';
	import {
		CollectionManager,
		CollectionTable,
		CollectionEmptyState,
		CollectionManagerHeader
	} from '$lib/collectionManager';
	import { createTypeProp } from '$lib/utils/typeProp';

	import { ArrowLeft } from 'svelte-heros-v2';
	import { Button, Heading } from 'flowbite-svelte';
	import Card from '$lib/components/card.svelte';

	//

	const recordType = createTypeProp<MultisignatureSealsResponse>();
</script>

<Card>
	<CollectionManager {recordType} collection={Collections.MultisignatureSeals} let:records>
		<CollectionManagerHeader hideCreateButton>
			<svelte:fragment slot="title">
				<Heading tag="h4">Multisignatures Seals</Heading>
			</svelte:fragment>
			<svelte:fragment slot="actions">
				<Button color="alternative" href="/my/multisignatures">
					<ArrowLeft /><span class="ml-2">Back to Multisignatures</span>
				</Button>
			</svelte:fragment>
		</CollectionManagerHeader>

		<CollectionTable {records}>
			<svelte:fragment slot="emptyState">
				<CollectionEmptyState
					hideCreateButton
					title="No pending seals to sign"
					description="Pending seals will appear here."
				/>
			</svelte:fragment>
		</CollectionTable>
	</CollectionManager>
</Card>
