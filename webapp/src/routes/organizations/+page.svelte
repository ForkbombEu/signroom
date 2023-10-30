<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import ModalWrapper from '$lib/components/modalWrapper.svelte';
	import { currentUser, pb } from '$lib/pocketbase/index.js';
	import type { OrganizationsResponse } from '$lib/pocketbase/types.js';
	import clsx from 'clsx';
	import { A, Avatar, Button, Heading, Modal, P } from 'flowbite-svelte';

	//

	export let data;
	$: organizations = data.organizations;

	let selectedOrganization: OrganizationsResponse | undefined = undefined;
	function selectOrganization(org: OrganizationsResponse) {
		selectedOrganization = org;
	}
</script>

<div class="space-y-8">
	<Heading tag="h4">Join an organization</Heading>
	<div class="space-y-6">
		{#each organizations as org}
			{@const avatarUrl = pb.files.getUrl(org, org.avatar)}
			{@const hasDescription = Boolean(org.description)}
			{@const containerClass = clsx('flex space-x-4', { 'items-center': !hasDescription })}
			<div class={containerClass}>
				<Avatar src={avatarUrl} size="md" class="shrink-0" />
				<div class="grow">
					<P weight="bold">{org.name}</P>
					<div class="text-gray-400 text-sm line-clamp-2 grow">
						{#if hasDescription}
							{@html org.description}
						{/if}
					</div>
				</div>
				<div class="pl-8 shrink-0 self-start">
					<Button
						color="alternative"
						on:click={() => {
							goto(`/register?join=${org.id}`)
							// selectOrganization(org);
						}}
					>
						Join
					</Button>
				</div>
			</div>
		{/each}
	</div>
</div>

<ModalWrapper>
	<Modal
		title={`Send a request to ${selectedOrganization?.name}`}
		open={Boolean(selectedOrganization)}
	>
		<P>Please confirm that you want to join this organization.</P>
		<div class="flex justify-end">
			<Button on:click={()=>goto(`/register?join=${selectedOrganization?.id}`)}>Login and join</Button>
		</div>
	</Modal>
</ModalWrapper>
