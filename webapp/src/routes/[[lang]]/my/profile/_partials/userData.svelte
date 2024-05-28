<script lang="ts">
	import { Heading, P, Button, Hr } from 'flowbite-svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import UserDataForm from './userDataForm.svelte';
	import { Pencil, XMark } from 'svelte-heros-v2';
	import UserAvatar from '$lib/components/userAvatar.svelte';
	import { m } from '$lib/i18n';

	let edit = false;
	const toggleEdit = () => {
		edit = !edit;
	};
</script>

<div class="space-y-6">
	<div class="flex flex-row items-center gap-6">
		<UserAvatar size="lg" />
		<div class="flex flex-col">
			<Heading tag="h4">{$currentUser?.name}</Heading>
			<P>
				{$currentUser?.email}
				<span class="ml-1 text-sm text-gray-400">
					({$currentUser?.emailVisibility ? 'public' : 'not public'})
				</span>
			</P>
		</div>
	</div>

	<div class="flex items-center justify-end gap-4">
		{#if edit}
			<Hr />
		{/if}
		<Button color="alternative" on:click={toggleEdit}>
			{#if !edit}
				<Pencil size="20" />
				<span class="ml-2">{m.Edit_profile()}</span>
			{:else}
				<XMark size="20" />
				<span class="ml-2">{m.Cancel()}</span>
			{/if}
		</Button>
	</div>

	{#if edit}
		<UserDataForm on:success={toggleEdit} />
	{/if}
</div>
