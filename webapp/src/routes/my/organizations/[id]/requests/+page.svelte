<script lang="ts">
	import { CollectionEmptyState } from '$lib/collectionManager';
	import CollectionManager from '$lib/collectionManager/collectionManager.svelte';
	import CollectionManagerHeader from '$lib/collectionManager/ui/collectionManagerHeader.svelte';
	import CollectionTable from '$lib/collectionManager/ui/collectionTable.svelte';
	import {
		Collections,
		type OrgJoinRequestsRecord,
		type UsersResponse
	} from '$lib/pocketbase/types';
	import { createTypeProp } from '$lib/utils/typeProp.js';
	import { Heading } from 'flowbite-svelte';
	import { UserGroup } from 'svelte-heros-v2';

	export let data;
	$: organization = data.organization;

	const recordType = createTypeProp<OrgJoinRequestsRecord>();
	const expandType = createTypeProp<{ user: UsersResponse }>();
</script>

<CollectionManager
	collection={Collections.OrgJoinRequests}
	initialQueryParams={{
		filter: `organization.id = "${organization.id}"`,
		expand: 'user'
	}}
	{recordType}
	{expandType}
	let:records
>
	<CollectionManagerHeader>
		<svelte:fragment slot="title">
			<Heading tag="h5">Manage join requests</Heading>
		</svelte:fragment>
	</CollectionManagerHeader>
	<CollectionTable {records} fields={['user', 'email']} hideActions={['edit', 'share']}>
		<svelte:fragment slot="emptyState">
			<CollectionEmptyState
				hideCreateButton
				description=""
				title="No join requests"
				icon={UserGroup}
			/>
		</svelte:fragment>
	</CollectionTable>
</CollectionManager>
