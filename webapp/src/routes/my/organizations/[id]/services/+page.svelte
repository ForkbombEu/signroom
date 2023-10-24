<script lang="ts">
	import { Collections, type ServicesRecord } from '$lib/pocketbase/types';
	import { CollectionManager, CollectionTable } from '$lib/collectionManager';
	import { Eye, Plus } from 'svelte-heros-v2';
	import { Button, Heading } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import { createTypeProp } from '$lib/utils/typeProp';
	import IconButton from '$lib/components/iconButton.svelte';

	export let data;
	let { organization } = data;

	const recordType = createTypeProp<ServicesRecord>();

	const serviceUrl = (id: string) => `${$page.url.pathname}/${id}`;
</script>

<div class="flex justify-between items-center mb-4">
	<Heading tag="h4">Services</Heading>
	<Button href={`${$page.url.pathname}/create`} color="alternative" class="shrink-0">
		<Plus size="20" />
		<span class="ml-1">Create new service</span>
	</Button>
</div>
<CollectionManager
	{recordType}
	collection={Collections.Services}
	let:records
	initialQueryParams={{
		filter: `organization.id = '${organization.id}'`
	}}
>
	<CollectionTable fields={['name', 'organization']} {records} hideActions={['edit', 'share']}>
		<svelte:fragment slot="actions" let:record>
			<IconButton size="sm" icon={Eye} border href={serviceUrl(record.id)} />
		</svelte:fragment>
	</CollectionTable>
</CollectionManager>
