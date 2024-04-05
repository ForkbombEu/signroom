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
	import { Avatar, Button, Modal, P } from 'flowbite-svelte';
	import PageTop from '$lib/components/pageTop.svelte';
	import Icon from '$lib/components/icon.svelte';
	import { ArrowLeft, UserGroup, UserPlus } from 'svelte-heros-v2';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import PageContent from '$lib/components/pageContent.svelte';
	import PageCard from '$lib/components/pageCard.svelte';
	import EmptyState from '$lib/components/emptyState.svelte';
	import PlainCard from '$lib/components/plainCard.svelte';

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

<PageTop>
	<Button href="/my/organizations" outline size="xs">
		<Icon src={ArrowLeft} mr></Icon>
		{m.Back_to_my_organizations()}
	</Button>

	<SectionTitle title={m.Join_an_organization()} hideLine></SectionTitle>
</PageTop>

<PageContent>
	<PageCard>
		{#if data.organizations.length == 0}
			<EmptyState title={m.No_available_organizations_found()} icon={UserGroup} />
		{:else}
			<div class="space-y-4">
				{#each organizations as org}
					{@const avatarUrl = pb.files.getUrl(org, org.avatar)}
					{@const hasDescription = Boolean(org.description)}

					<PlainCard let:Title let:Description>
						<div class="flex gap-4 items-center">
							<Avatar src={avatarUrl} size="md" class="shrink-0" />
							<div>
								<Title>{org.name}</Title>
								{#if hasDescription}
									<Description>
										<span class="line-clamp-2">
											{@html org.description}
										</span>
									</Description>
								{/if}
							</div>
						</div>

						<div slot="right" class="pl-8 shrink-0 self-start">
							{#if !isRequestAlreadySent(org)}
								<Button
									outline
									on:click={() => {
										selectOrganization(org);
									}}
								>
									{m.Join()}
									<Icon src={UserPlus} ml></Icon>
								</Button>
							{:else}
								<Button color="alternative" disabled>{m.Request_sent()}</Button>
							{/if}
						</div>
					</PlainCard>
				{/each}
			</div>
		{/if}
	</PageCard>
</PageContent>

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
