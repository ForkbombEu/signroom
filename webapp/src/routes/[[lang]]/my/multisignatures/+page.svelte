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
	import Card from '$lib/components/card.svelte';

	//

	const recordType = createTypeProp<MultisignaturesResponse>();
</script>

<Card>
	<CollectionManager {recordType} collection={Collections.Multisignatures} let:records>
		<CollectionManagerHeader hideCreateButton>
			<svelte:fragment slot="title">
				<Heading tag="h4">Multisignatures</Heading>
			</svelte:fragment>
			<svelte:fragment slot="actions">
				<Button color="alternative" href="/my/multisignatures/seals">
					<Eye /><span class="ml-2">View seals</span>
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
</Card>
