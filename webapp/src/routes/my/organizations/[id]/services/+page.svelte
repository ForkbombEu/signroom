<script lang="ts">
	import { Collections } from '$lib/pocketbase/types';
	import { CollectionManager, CollectionTable } from '$lib/collectionManager';
	import { Plus } from 'svelte-heros-v2';
	import { Button } from 'flowbite-svelte';
	import { page } from '$app/stores';
</script>

<div class="p-4">
	<div class="flex justify-end mb-4">
		<Button href={`${$page.url.pathname}/create`}>
			<Plus size="20" />
			<span class="ml-1">Create new service</span>
		</Button>
	</div>
	<CollectionManager collection={Collections.Services} let:records>
		<CollectionTable {records} let:record></CollectionTable>
	</CollectionManager>
</div>
