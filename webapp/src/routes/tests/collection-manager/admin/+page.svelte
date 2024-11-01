<script lang="ts">
	import { CollectionManager } from '@/collections-components/manager';
	import List from '@/components/custom/list.svelte';
	import ListItem from '@/components/custom/listItem.svelte';
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
	import PocketBase from 'pocketbase';
	import type { TypedPocketBase } from '@/pocketbase/types';

	const pbPromise = init();

	async function init() {
		const pb = new PocketBase(PUBLIC_POCKETBASE_URL) as TypedPocketBase;
		await pb.admins.authWithPassword('admin@example.org', 'adminadmin');
		return pb;
	}
</script>

{#await pbPromise then pb}
	<CollectionManager
		collection="users"
		fetchOptions={{
			perPage: 6,
			expand: [
				'users_public_keys_via_owner',
				'webauthnCredentials_via_user',
				'orgAuthorizations_via_user'
			]
		}}
		let:records
		{pb}
	>
		<List>
			{#each records as r}
				<ListItem>
					<pre>{JSON.stringify(r, null, 2)}</pre>
				</ListItem>
			{/each}
		</List>
	</CollectionManager>

	<!--  -->

	<CollectionManager
		collection="orgAuthorizations"
		fetchOptions={{
			perPage: 6,
			expand: ['role']
		}}
		let:records
		{pb}
	>
		<List>
			{#each records as r}
				<ListItem>
					<pre>{JSON.stringify(r.expand?.role, null, 2)}</pre>
				</ListItem>
			{/each}
		</List>
	</CollectionManager>
{/await}
