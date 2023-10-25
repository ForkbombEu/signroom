<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import ModalWrapper from '$lib/components/modalWrapper.svelte';
	import Input from '$lib/forms/fields/input.svelte';
	import Form, { createForm } from '$lib/forms/form.svelte';
	import SubmitButton from '$lib/forms/submitButton.svelte';
	import { currentUser, pb } from '$lib/pocketbase/index.js';
	import {
		Collections,
		OrgJoinRequestsStatusOptions,
		type OrgJoinRequestsRecord,
		type OrganizationsResponse,
		type OrgJoinRequestsResponse
	} from '$lib/pocketbase/types.js';
	import clsx from 'clsx';
	import { Avatar, Button, Heading, Modal, P } from 'flowbite-svelte';
	import { z } from 'zod';

	//

	export let data;
	$: organizations = data.organizations;
	$: orgJoinRequests = data.orgJoinRequests;

	//

	let selectedOrganization: OrganizationsResponse | undefined = undefined;
	function selectOrganization(org: OrganizationsResponse) {
		selectedOrganization = org;
	}

	//

	const formSchema = z.object({ email: z.string().email() });
	const superform = createForm(
		formSchema,
		async ({ form }) => {
			await pb.collection(Collections.OrgJoinRequests).create({
				user: $currentUser?.id!,
				organization: selectedOrganization?.id!,
				status: OrgJoinRequestsStatusOptions.pending,
				email: form.data.email
			} satisfies OrgJoinRequestsRecord);
			selectedOrganization = undefined;
			invalidateAll();
		},
		{ email: $currentUser?.email }
	);

	//

	function isRequestAlreadySent(organization: OrganizationsResponse): boolean {
		return Boolean(orgJoinRequests.find((request) => request.organization == organization.id));
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
				{#if !isRequestAlreadySent(org)}
					<Button
						color="alternative"
						class="self-start shrink-0"
						on:click={() => {
							selectOrganization(org);
						}}
					>
						Join
					</Button>
				{:else}
					<Button color="alternative" class="self-start shrink-0" disabled>Request sent</Button>
				{/if}
			</div>
		{/each}
	</div>
</div>

<ModalWrapper>
	<Modal
		title={`Send a request to ${selectedOrganization?.name}`}
		open={Boolean(selectedOrganization)}
	>
		<Form {superform}>
			<Input field="email" />
			<div class="flex justify-end">
				<SubmitButton>Send request</SubmitButton>
			</div>
		</Form>
	</Modal>
</ModalWrapper>
