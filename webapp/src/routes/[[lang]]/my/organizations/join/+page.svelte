<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import PortalWrapper from '$lib/components/portalWrapper.svelte';
	import { currentUser, pb } from '$lib/pocketbase/index.js';
	import {
		Collections,
		OrgJoinRequestsStatusOptions,
		type OrgJoinRequestsRecord,
		type OrganizationsResponse
	} from '$lib/pocketbase/types.js';
	import { m } from '$lib/i18n';
	import clsx from 'clsx';
	import { A, Avatar, Button, Heading, Modal, P } from 'flowbite-svelte';

	//

	export let data;
	$: organizations = data.organizations;
	$: orgJoinRequests = data.orgJoinRequests;

	//

	let selectedOrganization: OrganizationsResponse | undefined = undefined;
	function selectOrganization(org: OrganizationsResponse) {
		selectedOrganization = org;
	}

	async function sendJoinRequest() {
		await pb.collection(Collections.OrgJoinRequests).create({
			user: $currentUser?.id!,
			organization: selectedOrganization?.id!,
			status: OrgJoinRequestsStatusOptions.pending,
			reminders: 0
		} satisfies OrgJoinRequestsRecord);
		selectedOrganization = undefined;
		invalidateAll();
	}

	function isRequestAlreadySent(organization: OrganizationsResponse): boolean {
		return Boolean(orgJoinRequests.find((request) => request.organization == organization.id));
	}
</script>

<div class="space-y-8">
	<A href="/my/organizations">← {m.My_organizations()}</A>
	<Heading tag="h4">{m.Join_an_organization()}</Heading>
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
					{#if !isRequestAlreadySent(org)}
						<Button
							color="alternative"
							on:click={() => {
								selectOrganization(org);
							}}
						>
							{m.Join()}
						</Button>
					{:else}
						<Button color="alternative" disabled>{m.Request_sent()}</Button>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<PortalWrapper>
	<Modal
		title={`${m.Send_a_request_to()} ${selectedOrganization?.name}`}
		open={Boolean(selectedOrganization)}
	>
		<P>{m.Please_confirm_that_you_want_to_join_this_organization_()}</P>
		<div class="flex justify-end">
			<Button on:click={sendJoinRequest}>{m.Send_join_request()}</Button>
		</div>
	</Modal>
</PortalWrapper>
