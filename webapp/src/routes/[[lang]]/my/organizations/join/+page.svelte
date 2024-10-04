<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { currentUser, pb } from '$lib/pocketbase/index.js';
	import {
		OrgJoinRequestsStatusOptions,
		type OrgAuthorizationsResponse,
		type OrgJoinRequestsRecord,
		type OrgJoinRequestsResponse,
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
	import ModalWrapper from '$lib/components/modalWrapper.svelte';
	import CollectionManager from '$lib/collectionManager/collectionManager.svelte';
	import { createTypeProp } from '$lib/utils/typeProp';

	//

	async function sendJoinRequest(org: OrganizationsResponse) {
		pb.collection('orgJoinRequests').create({
			user: $currentUser?.id!,
			organization: org.id!,
			status: OrgJoinRequestsStatusOptions.pending,
			reminders: 0
		} satisfies OrgJoinRequestsRecord);
	}

	const expandOrgJoinReq = 'orgJoinRequests_via_organization';
	const expandOrgAuth = 'orgAuthorizations_via_organization';
	const expand = [expandOrgJoinReq, expandOrgAuth].join(', ');
	const recordType = createTypeProp<
		OrganizationsResponse<{
			[expandOrgJoinReq]: OrgJoinRequestsResponse[];
			[expandOrgAuth]: OrgAuthorizationsResponse[];
		}>
	>();
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
		<CollectionManager
			{recordType}
			collection="organizations"
			initialQueryParams={{
				expand,
				filter: `(id != orgAuthorizations_via_organization.organization.id) && (orgAuthorizations_via_organization.user.id = "${$currentUser?.id}")`
			}}
			subscribe={['orgJoinRequests']}
			let:records
		>
			<svelte:fragment slot="emptyState">
				<EmptyState title={m.No_available_organizations_found()} icon={UserGroup} />
			</svelte:fragment>

			{#if records.length > 0}
				<div class="space-y-2">
					{#each records as org}
						{@const avatarUrl = pb.files.getUrl(org, org.avatar)}
						{@const hasDescription = Boolean(org.description)}
						{@const sentMembershipRequest = org.expand?.[expandOrgJoinReq]?.at(0)}
						{@const orgAuthorization = org.expand?.[expandOrgAuth]?.at(0)}

						{#if !orgAuthorization}
							<PlainCard let:Title let:Description>
								<div class="flex items-center gap-4">
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

								<div slot="right" class="shrink-0 self-start pl-8">
									{#if !sentMembershipRequest}
										<ModalWrapper title={`${m.Send_a_request_to()} ${org.name}`} let:openModal>
											<Button outline on:click={openModal}>
												{m.Join()}
												<Icon src={UserPlus} ml></Icon>
											</Button>

											<svelte:fragment slot="modal" let:closeModal>
												<P>{m.Please_confirm_that_you_want_to_join_this_organization_()}</P>
												<div class="flex items-center justify-center gap-2">
													<Button color="alternative" on:click={closeModal}>
														{m.Cancel()}
													</Button>
													<Button on:click={() => sendJoinRequest(org).then(closeModal)}>
														{m.Send_join_request()}
													</Button>
												</div>
											</svelte:fragment>
										</ModalWrapper>
									{:else}
										<Button color="alternative" disabled>{m.Request_sent()}</Button>
									{/if}
								</div>
							</PlainCard>
						{/if}
					{/each}
				</div>
			{/if}
		</CollectionManager>
	</PageCard>
</PageContent>
