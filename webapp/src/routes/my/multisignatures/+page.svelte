<script lang="ts">
	import { Collections, type MultisignaturesResponse } from '$lib/pocketbase/types';
	import {
		CollectionManager,
		CollectionTable,
		CollectionEmptyState,
		CollectionManagerHeader
	} from '$lib/collectionManager';
	import { createTypeProp } from '$lib/utils/typeProp';

	import { Eye, Plus } from 'svelte-heros-v2';
	import { Button, Heading } from 'flowbite-svelte';

	//

	const recordType = createTypeProp<MultisignaturesResponse>();
</script>

<CollectionManager {recordType} collection={Collections.Multisignatures} let:records>
	<CollectionManagerHeader hideCreateButton>
		<svelte:fragment slot="title">
			<Heading tag="h3">Multisignatures</Heading>
		</svelte:fragment>
		<svelte:fragment slot="actions">
			<Button color="alternative" href="/my/multisignatures/requests">
				<Eye /><span class="ml-2">View requests</span>
			</Button>
			<Button href="/my/multisignatures/create">
				<Plus /><span>Create a new multisignature</span>
			</Button>
		</svelte:fragment>
	</CollectionManagerHeader>
	<CollectionTable {records}>
		<svelte:fragment slot="emptyState">
			<CollectionEmptyState hideCreateButton />
		</svelte:fragment>
	</CollectionTable>
</CollectionManager>
