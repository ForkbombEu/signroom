<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import CollectionManager from '$lib/collectionManager/collectionManager.svelte';
	import { pb } from '$lib/pocketbase/index.js';
	import {
		Collections,
		OrgJoinRequestsStatusOptions,
		type OrgJoinRequestsRecord,
		type UsersResponse,
		type OrgAuthorizationsRecord,
		type OrgJoinRequestsResponse,
		type OrganizationsResponse
	} from '$lib/pocketbase/types';
	import { OrgRoles } from '$lib/organizations';
	import { createTypeProp } from '$lib/utils/typeProp.js';
	import { m } from '$lib/i18n';
	import { Button } from 'flowbite-svelte';
	import { UserPlus, NoSymbol, UserGroup } from 'svelte-heros-v2';
	import DeleteRecord from '$lib/collectionManager/ui/recordActions/deleteRecord.svelte';
	import PlainCard from '$lib/components/plainCard.svelte';
	import { getUserDisplayName } from '$lib/utils/pb';
	import UserAvatar from '$lib/components/userAvatar.svelte';
	import Icon from '$lib/components/icon.svelte';
	import EmptyState from '$lib/components/emptyState.svelte';
	import SectionTitle from '$lib/components/sectionTitle.svelte';

	//

	export let organization: OrganizationsResponse;

	const recordType = createTypeProp<OrgJoinRequestsResponse<{ user: UsersResponse }>>();

	//

	const { accepted, rejected, pending } = OrgJoinRequestsStatusOptions;

	async function updateRequestStatus(
		request: OrgJoinRequestsResponse,
		status: OrgJoinRequestsStatusOptions
	) {
		await pb.collection('orgJoinRequests').update(request.id, {
			status
		} satisfies Partial<OrgJoinRequestsRecord>);
	}

	async function acceptRequest(request: OrgJoinRequestsResponse) {
		await updateRequestStatus(request, accepted);

		const memberRole = await pb
			.collection('orgRoles')
			.getFirstListItem(`name = "${OrgRoles.MEMBER}"`);

		await pb.collection('orgAuthorizations').create({
			organization: organization.id,
			user: request.user,
			role: memberRole.id
		} satisfies OrgAuthorizationsRecord);
	}
</script>

<CollectionManager
	collection={Collections.OrgJoinRequests}
	initialQueryParams={{
		filter: `organization.id = "${organization.id}" && status = "${pending}"`,
		expand: 'user'
	}}
	{recordType}
	let:records
>
	<SectionTitle
		tag="h5"
		title={m.Pending_membership_requests()}
		description={m.pending_membership_requests_description()}
	/>

	<svelte:fragment slot="emptyState">
		<EmptyState icon={UserGroup} title={m.No_new_membership_requests()}></EmptyState>
	</svelte:fragment>

	{#each records as request}
		{@const user = request.expand?.user}
		{#if user}
			<PlainCard>
				<UserAvatar slot="left" size="md" {user}></UserAvatar>
				{getUserDisplayName(user)}

				<svelte:fragment slot="right">
					<div class="space-x-1">
						<Button
							outline
							on:click={() => {
								acceptRequest(request);
							}}
						>
							{m.Accept()}
							<Icon src={UserPlus} ml></Icon>
						</Button>

						<DeleteRecord record={request} let:openModal>
							<Button outline on:click={openModal}>
								{m.Decline()}
								<Icon src={NoSymbol} ml></Icon>
							</Button>
						</DeleteRecord>
					</div>
				</svelte:fragment>
			</PlainCard>
		{/if}
	{/each}
</CollectionManager>
