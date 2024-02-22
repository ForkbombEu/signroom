<script lang="ts">
	import { Collections, type MultisignatureRequestsResponse } from '$lib/pocketbase/types';
	import {
		CollectionManager,
		CollectionTable,
		CollectionEmptyState,
		CollectionManagerHeader
	} from '$lib/collectionManager';
	import { createTypeProp } from '$lib/utils/typeProp';

	import { ArrowLeft } from 'svelte-heros-v2';
	import { Button, Heading } from 'flowbite-svelte';

	//

	const recordType = createTypeProp<MultisignatureRequestsResponse>();
</script>

<CollectionManager {recordType} collection={Collections.MultisignatureRequests} let:records>
	<CollectionManagerHeader hideCreateButton>
		<svelte:fragment slot="title">
			<Heading tag="h3">Multisignatures Requests</Heading>
		</svelte:fragment>
		<svelte:fragment slot="actions">
			<Button color="alternative" href="/my/multisignatures">
				<ArrowLeft /><span class="ml-2">Back to multisignatures</span>
			</Button>
		</svelte:fragment>
	</CollectionManagerHeader>

	<CollectionTable {records}>
		<svelte:fragment slot="emptyState">
			<CollectionEmptyState hideCreateButton />
		</svelte:fragment>
	</CollectionTable>
</CollectionManager>
