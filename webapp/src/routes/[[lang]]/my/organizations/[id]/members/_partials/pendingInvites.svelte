<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import CollectionManager from '$lib/collectionManager/collectionManager.svelte';
	import { pb } from '$lib/pocketbase/index.js';
	import {
		OrgJoinRequestsStatusOptions,
		type OrgJoinRequestsRecord,
		type UsersResponse,
		type OrgJoinRequestsResponse,
		type OrganizationsResponse,
		type OrgInvitesResponse
	} from '$lib/pocketbase/types';
	import { createTypeProp } from '$lib/utils/typeProp.js';
	import { m } from '$lib/i18n';
	import { Badge, Button } from 'flowbite-svelte';
	import { UserPlus, NoSymbol, UserGroup, Trash } from 'svelte-heros-v2';
	import PlainCard from '$lib/components/plainCard.svelte';
	import { getUserDisplayName } from '$lib/utils/pb';
	import UserAvatar from '$lib/components/userAvatar.svelte';
	import Icon from '$lib/components/icon.svelte';
	import EmptyState from '$lib/components/emptyState.svelte';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import ModalWrapper from '$lib/components/modalWrapper.svelte';
	import { DeleteRecord } from '$lib/collectionManager';
	import IconButton from '$lib/components/iconButton.svelte';
	import PageCard from '$lib/components/pageCard.svelte';

	//

	export let organization: OrganizationsResponse;

	const recordType = createTypeProp<OrgInvitesResponse>();
</script>

<CollectionManager
	collection="org_invites"
	initialQueryParams={{
		filter: `organization.id = "${organization.id}"`
	}}
	{recordType}
	let:records
	hideEmptyState
>
	{#if records.length}
		<PageCard class="!space-y-6">
			<SectionTitle
				tag="h5"
				title={m.Pending_invites()}
				description={m.pending_invites_description()}
			/>

			<div class="max-h-[400px] divide-y overflow-auto rounded-lg border">
				{#each records as invite}
					<div class="flex items-center justify-between px-2 py-1 pl-4">
						<div class="flex items-center gap-2">
							<p class="text-sm">
								{invite.user_email}
							</p>
							{#if invite.failed_email_send}
								<Badge color="red">{m.failed_email_send()}</Badge>
							{/if}
							{#if invite.declined}
								<Badge color="red">{m.invite_declined()}</Badge>
							{/if}
						</div>

						<DeleteRecord record={invite} let:openModal>
							<IconButton icon={Trash} on:click={openModal} />
						</DeleteRecord>
					</div>
				{/each}
			</div>
		</PageCard>
	{/if}
</CollectionManager>
