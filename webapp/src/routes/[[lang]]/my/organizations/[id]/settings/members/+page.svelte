<script lang="ts">
	import { CollectionManager } from '$lib/collectionManager';
	import CreateRecord from '$lib/collectionManager/ui/recordActions/createRecord.svelte';
	import {
		Collections,
		type OrgAuthorizationsResponse,
		type OrgRolesResponse,
		type UsersResponse
	} from '$lib/pocketbase/types';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { m } from '$lib/i18n';
	import { OrgRoles } from '$lib/rbac';

	import { Button, Badge } from 'flowbite-svelte';
	import { Pencil, Plus, XMark } from 'svelte-heros-v2';

	import PageCard from '$lib/components/pageCard.svelte';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import PlainCard from '$lib/components/plainCard.svelte';
	import UserAvatar from '$lib/components/userAvatar.svelte';
	import { currentUser } from '$lib/pocketbase/index.js';
	import { c } from '$lib/utils/strings.js';
	import EditRecord from '$lib/collectionManager/ui/recordActions/editRecord.svelte';
	import DeleteRecord from '$lib/collectionManager/ui/recordActions/deleteRecord.svelte';

	//

	export let data;
	$: organization = data.organization;

	type AuthorizationWithUser = OrgAuthorizationsResponse<{
		user: UsersResponse;
		role: OrgRolesResponse;
	}>;

	const recordType = createTypeProp<AuthorizationWithUser>();

	function getUserDisplayName(user: UsersResponse) {
		return user.name ? user.name : user.username ? user.username : user.email;
	}
</script>

<PageCard>
	<CollectionManager
		{recordType}
		collection={Collections.OrgAuthorizations}
		formSettings={{
			hide: { organization: organization.id },
			relations: {
				role: { inputMode: 'select', displayFields: ['name'] },
				user: { displayFields: ['name'] }
			}
		}}
		editFormSettings={{
			exclude: ['user']
		}}
		initialQueryParams={{ expand: 'user,role', filter: `organization.id="${organization.id}"` }}
		let:records
	>
		<SectionTitle tag="h5" title={m.Members()}>
			<CreateRecord {recordType} slot="right">
				<svelte:fragment slot="button" let:openModal>
					<Button on:click={openModal} class="shrink-0">
						<Plus size="20" class="mr-2" />
						{m.Add_new_member()}
					</Button>
				</svelte:fragment>
			</CreateRecord>
		</SectionTitle>

		{#each records as record}
			{@const user = record.expand?.user}
			{@const role = record.expand?.role}
			{#if user && role}
				<PlainCard>
					<div class="flex items-center gap-4">
						<UserAvatar size="md" {user}></UserAvatar>
						<p>
							{getUserDisplayName(user)}
						</p>
						<div class="flex gap-2">
							{#if user.id == $currentUser?.id}
								<Badge color="dark">{m.You()}</Badge>
							{/if}
							{#if role.name != OrgRoles.MEMBER}
								<Badge color="dark">{c(role.name)}</Badge>
							{/if}
						</div>
					</div>

					<svelte:fragment slot="right">
						<div class="space-x-1">
							<EditRecord {record} let:openModal>
								<Button outline color="primary" size="sm" on:click={openModal}>
									Edit role
									<Pencil size="20" class="ml-2"></Pencil>
								</Button>
							</EditRecord>

							<DeleteRecord {record} let:openModal>
								<Button outline color="primary" size="sm" on:click={openModal}>
									Remove
									<XMark size="20" class="ml-2"></XMark>
								</Button>
							</DeleteRecord>
						</div>
					</svelte:fragment>
				</PlainCard>
			{/if}
		{/each}
	</CollectionManager>
</PageCard>
