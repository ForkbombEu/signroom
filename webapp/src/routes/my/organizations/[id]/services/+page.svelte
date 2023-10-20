<script lang="ts">
	import { Collections, type ServicesRecord } from '$lib/pocketbase/types';
	import { CollectionManager, CollectionTable } from '$lib/collectionManager';
	import { Eye, Plus } from 'svelte-heros-v2';
	import { Button } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import { createTypeProp } from '$lib/utils/typeProp';
	import IconButton from '$lib/components/iconButton.svelte';

	const recordType = createTypeProp<ServicesRecord>();

	const serviceUrl = (id: string) => `${$page.url.pathname}/${id}`;
</script>

<div class="p-4">
	<div class="flex justify-end mb-4">
		<Button href={`${$page.url.pathname}/create`}>
			<Plus size="20" />
			<span class="ml-1">Create new service</span>
		</Button>
	</div>
	<CollectionManager {recordType} collection={Collections.Services} let:records>
		<CollectionTable fields={['name']} {records} hideActions={['edit', 'share']}>
			<svelte:fragment slot="actions" let:record>
				<IconButton size="sm" icon={Eye} border href={serviceUrl(record.id)} />
			</svelte:fragment>
		</CollectionTable>
	</CollectionManager>
</div>
