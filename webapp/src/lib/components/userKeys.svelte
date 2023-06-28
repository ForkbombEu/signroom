<script lang="ts">
	import { Card, MenuButton, Dropdown, DropdownItem, Avatar, Button } from 'flowbite-svelte';
	import { currentUser } from '$lib/pocketbase';
	import List from '$lib/components/list.svelte';
	const keys = [
		{ title: 'Ethereum Address', value: $currentUser?.ethereum_address },
		{ title: 'ecdh public key', value: $currentUser?.ecdh_public_key },
		{ title: 'eddsa public key', value: $currentUser?.eddsa_public_key },
		{ title: 'reflow public key', value: $currentUser?.reflow_public_key }
	];
</script>

<Card padding="sm" class="!max-w-none w-full">
	<List rows={keys} />
	<div class="flex justify-end">
		<Button color="primary" size="sm" class="mt-4">
			Generate new keys
		</Button>
</Card>
