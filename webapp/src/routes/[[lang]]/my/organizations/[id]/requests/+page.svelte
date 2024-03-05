<script lang="ts">
	import { CollectionEmptyState } from '$lib/collectionManager';
	import CollectionManager from '$lib/collectionManager/collectionManager.svelte';
	import CollectionManagerHeader from '$lib/collectionManager/ui/collectionManagerHeader.svelte';
	import CollectionTable from '$lib/collectionManager/ui/collectionTable.svelte';
	import { pb } from '$lib/pocketbase/index.js';
	import {
		Collections,
		OrgJoinRequestsStatusOptions,
		type OrgJoinRequestsRecord,
		type UsersResponse,
		type OrgAuthorizationsRecord,

		type OrgJoinRequestsResponse

	} from '$lib/pocketbase/types';
	import { OrgRoles } from '$lib/rbac/roles.js';
	import { createTypeProp } from '$lib/utils/typeProp.js';
	import { m } from '$lib/i18n';
	import { Button, Heading } from 'flowbite-svelte';
	import { ArrowUturnLeft, Check, UserGroup, XMark } from 'svelte-heros-v2';
	import User from './_partials/user.svelte';

	export let data;
	$: organization = data.organization;

	const recordType = createTypeProp<OrgJoinRequestsResponse<{ user: UsersResponse }>>();

	//

	const { accepted, rejected, pending } = OrgJoinRequestsStatusOptions;

	async function updateRequestStatus(
		request: OrgJoinRequestsResponse,
		status: OrgJoinRequestsStatusOptions
	) {
		await pb.collection(Collections.OrgJoinRequests).update(request.id, {
			status
		} satisfies Partial<OrgJoinRequestsRecord>);
	}

	async function acceptRequest(request: OrgJoinRequestsResponse) {
		await updateRequestStatus(request, accepted);
		const memberRole = await pb
			.collection(Collections.OrgRoles)
			.getFirstListItem(`name = "${OrgRoles.MEMBER}"`);
		await pb.collection(Collections.OrgAuthorizations).create({
			organization: organization.id,
			user: request.user,
			role: memberRole.id
		} satisfies OrgAuthorizationsRecord);
	}

	async function rejectRequest(request: OrgJoinRequestsResponse) {
		await updateRequestStatus(request, rejected);
	}

	async function appendRequest(request: OrgJoinRequestsResponse) {
		await updateRequestStatus(request, pending);
	}
</script>

<div class="space-y-8">
	<CollectionManager
		collection={Collections.OrgJoinRequests}
		initialQueryParams={{
			filter: `organization.id = "${organization.id}"`,
			expand: 'user'
		}}
		{recordType}
		let:records
	>
		{@const pendingRequests = records.filter((r) => r.status == pending)}
		{@const rejectedRequests = records.filter((r) => r.status == rejected)}

		<div>
			<CollectionManagerHeader hideCreateButton>
				<svelte:fragment slot="title">
					<Heading tag="h5">{m.Manage_pending_join_requests()}</Heading>
				</svelte:fragment>
			</CollectionManagerHeader>
			<CollectionTable
				records={pendingRequests}
				fields={['user', 'status']}
				hideActions={['edit', 'share', 'select']}
				fieldsComponents={{"user":User}}
			>
				<svelte:fragment slot="emptyState">
					<CollectionEmptyState
						hideCreateButton
						description=""
						title={m.No_join_requests()}
						icon={UserGroup}
					/>
				</svelte:fragment>
				<svelte:fragment slot="actions" let:record>
					<Button
						size="sm"
						color="alternative"
						on:click={() => {
							acceptRequest(record);
						}}
					>
						<Check size="20" />
						<span class="ml-1"> {m.Accept()} </span>
					</Button>
					<Button
						size="sm"
						color="alternative"
						on:click={() => {
							rejectRequest(record);
						}}
					>
						<XMark size="20" />
						<span class="ml-1"> {m.Reject()} </span>
					</Button>
				</svelte:fragment>
			</CollectionTable>
		</div>

		<div>
			<CollectionManagerHeader hideCreateButton>
				<svelte:fragment slot="title">
					<Heading tag="h5">{m.Rejected_requests()}</Heading>
				</svelte:fragment>
			</CollectionManagerHeader>
			<CollectionTable
				records={rejectedRequests}
				fields={['user', 'status']}
				hideActions={['edit', 'share', 'select']}
			>
				<svelte:fragment slot="emptyState">
					<CollectionEmptyState
						hideCreateButton
						description=""
						title={m.No_rejected_requests()}
						icon={UserGroup}
					/>
				</svelte:fragment>
				<svelte:fragment slot="actions" let:record>
					<Button
						size="sm"
						color="alternative"
						on:click={() => {
							appendRequest(record);
						}}
					>
						<ArrowUturnLeft size="20" />
						<span class="ml-1"> {m.Move_to_pending()} </span>
					</Button>
				</svelte:fragment>
			</CollectionTable>
		</div>
	</CollectionManager>
</div>
