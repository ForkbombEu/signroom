<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { OrgRoles } from '$lib/organizations';
	import { Button, A, P, Badge, Avatar } from 'flowbite-svelte';
	import { Plus, UserPlus, Cog, PuzzlePiece, ArrowUturnLeft, XMark, Check } from 'svelte-heros-v2';
	import { c } from '$lib/utils/strings.js';
	import { currentUser, pb } from '$lib/pocketbase/index.js';
	import { invalidateAll } from '$app/navigation';
	import { m } from '$lib/i18n';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import PageCard from '$lib/components/pageCard.svelte';
	import PageTop from '$lib/components/pageTop.svelte';
	import Icon from '$lib/components/icon.svelte';
	import PageContent from '$lib/components/pageContent.svelte';
	import EmptyState from '$lib/components/emptyState.svelte';
	import PlainCard from '$lib/components/plainCard.svelte';
	import CollectionManager from '$lib/collectionManager/collectionManager.svelte';
	import { createTypeProp } from '$lib/utils/typeProp';
	import type {
		OrganizationsResponse,
		OrgAuthorizationsResponse,
		OrgInvitesResponse,
		OrgJoinRequestsResponse,
		OrgRolesResponse
	} from '$lib/pocketbase/types';

	//

	const { ADMIN, OWNER } = OrgRoles;

	/* Org invites */

	function updateInvite(inviteId: string, action: 'accept' | 'decline') {
		pb.send(`/organizations/invites/${action}`, {
			method: 'POST',
			body: {
				inviteId
			}
		});
	}

	const invitesType = createTypeProp<OrgInvitesResponse<{ organization: OrganizationsResponse }>>();

	/* Org membership requests */

	async function deleteJoinRequest(requestId: string) {
		await pb.collection('orgJoinRequests').delete(requestId);
		invalidateAll();
	}

	const joinRequestsType =
		createTypeProp<OrgJoinRequestsResponse<{ organization: OrganizationsResponse }>>();

	/* Org list */

	const authorizationsType =
		createTypeProp<
			OrgAuthorizationsResponse<{ organization: OrganizationsResponse; role: OrgRolesResponse }>
		>();
</script>

<PageTop>
	<SectionTitle title={m.My_organizations()} description={m.organzations_page_description()} />
</PageTop>

<PageContent>
	<CollectionManager
		collection="org_invites"
		recordType={invitesType}
		initialQueryParams={{
			filter: `user.id = "${$currentUser?.id ?? ''}" && declined = false`,
			expand: 'organization'
		}}
		hideEmptyState
		let:records
	>
		{#if records.length > 0}
			<PageCard>
				<SectionTitle tag="h5" title={m.organization_invites()} />
				{#each records as record}
					<PlainCard>
						{record.expand?.organization.name}
						<svelte:fragment slot="right">
							<Button outline on:click={() => updateInvite(record.id, 'accept')}>
								{m.accept_invite()}<Icon src={Check} ml />
							</Button>
							<Button outline on:click={() => updateInvite(record.id, 'decline')}>
								{m.decline_invite()}<Icon src={XMark} ml />
							</Button>
						</svelte:fragment>
					</PlainCard>
				{/each}
			</PageCard>
		{/if}
	</CollectionManager>

	<CollectionManager
		collection="orgJoinRequests"
		recordType={joinRequestsType}
		initialQueryParams={{ expand: 'organization', filter: `user.id = "${$currentUser?.id}"` }}
		hideEmptyState
		let:records
	>
		{#if records.length}
			<PageCard>
				<SectionTitle tag="h5" title={m.Your_membership_requests()}></SectionTitle>

				<div class="space-y-4">
					{#each records as request}
						{@const organization = request.expand?.organization}
						{#if organization}
							{@const avatarUrl = pb.files.getUrl(organization, organization.avatar)}
							<PlainCard>
								<Avatar slot="left" src={avatarUrl}></Avatar>

								<div class="flex items-center space-x-2">
									<P>{request.expand?.organization.name}</P>
									<Badge color="yellow">{m.Pending()}</Badge>
								</div>

								<Button
									slot="right"
									outline
									size="sm"
									on:click={() => {
										deleteJoinRequest(request.id);
									}}
								>
									{m.Undo_request()}
									<Icon src={ArrowUturnLeft} ml></Icon>
								</Button>
							</PlainCard>
						{/if}
					{/each}
				</div>
			</PageCard>
		{/if}
	</CollectionManager>

	<PageCard>
		<SectionTitle tag="h5" title={m.Your_organizations()}>
			<div slot="right" class="flex justify-end gap-2">
				<Button size="sm" outline class="shrink-0 !px-4" href="/my/organizations/join">
					<span class="ml-1"> {m.Join_an_organization()} </span>
					<Icon src={UserPlus} ml />
				</Button>
				<Button size="sm" class="shrink-0 !px-4" href="/my/organizations/create">
					<span class="ml-1"> {m.Create_a_new_organization()} </span>
					<Icon src={Plus} ml />
				</Button>
			</div>
		</SectionTitle>

		<CollectionManager
			collection="orgAuthorizations"
			recordType={authorizationsType}
			initialQueryParams={{
				expand: 'organization,role',
				filter: `user.id = "${$currentUser?.id}"`
			}}
			let:records
		>
			<svelte:fragment slot="emptyState">
				<EmptyState title={m.You_havent_added_any_organizations_yet_()} icon={PuzzlePiece} />
			</svelte:fragment>

			{#if records.length > 0}
				<div class="space-y-2">
					{#each records as a}
						{@const org = a.expand?.organization}
						{@const role = a.expand?.role}
						{#if org && role}
							<PlainCard let:Title let:Description>
								<div class="flex items-center gap-2">
									<Title>
										<A href={`/my/organizations/${org.id}`}>{org.name}</A>
									</Title>
									{#if role.name == ADMIN || role.name == OWNER}
										<Badge color="dark">{c(role.name)}</Badge>
									{/if}
								</div>
								{#if org.description}
									<Description>{org.description}</Description>
								{/if}

								<svelte:fragment slot="right">
									{#if role.name == OWNER}
										<Button
											data-testid={`${org.name} link`}
											size="sm"
											outline
											href={`/my/organizations/${org.id}/settings`}
										>
											{m.Settings()}
											<Icon src={Cog} ml></Icon>
										</Button>
									{/if}
								</svelte:fragment>
							</PlainCard>
						{/if}
					{/each}
				</div>
			{/if}
		</CollectionManager>
	</PageCard>
</PageContent>
