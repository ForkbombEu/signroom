<script lang="ts">
	import { CollectionManager } from '@/collections-components/manager';
	import { m } from '@/i18n';
	import { OrgRoles, ProtectedOrgUI } from '@/organizations';
	import Button from '@/components/ui/button/button.svelte';
	import { Pencil, Plus, X } from 'lucide-svelte';
	import Badge from '@/components/ui/badge/badge.svelte';
	import PageCard from '@/components/layout/pageCard.svelte';
	import SectionTitle from '@/components/custom/sectionTitle.svelte';
	import PlainCard from '@/components/custom/itemCard.svelte';
	import UserAvatar from '@/components/custom/userAvatar.svelte';
	import { currentUser } from '@/pocketbase/index.js';
	import { RecordEdit, RecordDelete } from '@/collections-components/manager';
	import MembershipRequests from './_partials/membershipRequests.svelte';
	import { getUserDisplayName } from '@/pocketbase/utils';
	import OrganizationLayout from '@/organizations/components/organizationLayout.svelte';
	import InviteMembersForm from './_partials/inviteMembersForm.svelte';
	import PendingInvites from './_partials/pendingInvites.svelte';
	import { createToggleStore } from '@/components/custom/utils';
	import Dialog from '@/components/custom/dialog.svelte';
	import Icon from '@/components/custom/icon.svelte';
	import { capitalize } from '@/utils/other';
	import { CollectionForm } from '@/collections-components';

	//

	export let data;
	$: organization = data.organization;
	$: userRole = data.userRole;

	//

	const showInviteModal = createToggleStore(false);
</script>

<OrganizationLayout org={organization}>
	<ProtectedOrgUI orgId={organization.id} roles={['admin', 'owner']}>
		<MembershipRequests {organization} />
		<PendingInvites {organization} />
	</ProtectedOrgUI>

	<PageCard>
		<CollectionManager
			collection="orgAuthorizations"
			queryOptions={{
				expand: ['user', 'role'],
				filter: `organization.id="${organization.id}"`
			}}
			formFieldsOptions={{
				hide: { organization: organization.id },
				relations: {
					role: { mode: 'select', displayFields: ['name'] },
					user: { displayFields: ['name'] }
				}
			}}
			editFormFieldsOptions={{
				exclude: ['user', 'organization']
			}}
			let:records
		>
			<SectionTitle slot="top" title={m.Members()} description={m.members_description()}>
				<ProtectedOrgUI orgId={organization.id} roles={['admin', 'owner']} slot="right">
					<Dialog bind:open={$showInviteModal} title={m.invite_members()}>
						<svelte:fragment slot="trigger" let:builder>
							<Button variant="outline" builders={[builder]}>
								<Plus size="20" class="mr-2" />
								{m.invite_members()}
							</Button>
						</svelte:fragment>

						<svelte:fragment slot="content" let:closeDialog>
							<InviteMembersForm
								organizationId={organization.id}
								onSuccess={closeDialog}
								onCancel={closeDialog}
							/>
						</svelte:fragment>
					</Dialog>
				</ProtectedOrgUI>
			</SectionTitle>

			<div class="space-y-2">
				{#each records as record}
					{@const user = record.expand?.user}
					{@const role = record.expand?.role}
					{#if user && role && userRole}
						<PlainCard>
							<div class="flex items-center gap-4">
								<UserAvatar {user}></UserAvatar>
								<p>
									{getUserDisplayName(user)}
								</p>
								<div class="flex gap-1">
									{#if user.id == $currentUser?.id}
										<Badge>{m.You()}</Badge>
									{/if}
									{#if role.name != OrgRoles.MEMBER}
										<Badge variant="secondary">{capitalize(role.name)}</Badge>
									{/if}
								</div>
							</div>

							<svelte:fragment slot="right">
								<ProtectedOrgUI orgId={organization.id} roles={['admin', 'owner']}>
									<div class="space-x-1">
										{#if userRole.level < role.level}
											<RecordEdit {record}>
												<svelte:fragment slot="trigger" let:builder>
													<Button variant="outline" size="sm" builders={[builder]}>
														{m.Edit_role()}
														<Icon src={Pencil} ml />
													</Button>
												</svelte:fragment>
											</RecordEdit>

											<RecordDelete {record}>
												<svelte:fragment slot="trigger" let:builder>
													<Button variant="outline" size="sm" builders={[builder]}>
														{m.Remove()}
														<Icon src={X} ml />
													</Button>
												</svelte:fragment>
											</RecordDelete>
										{/if}
									</div>
								</ProtectedOrgUI>
							</svelte:fragment>
						</PlainCard>
					{/if}
				{/each}
			</div>
		</CollectionManager>
	</PageCard>
</OrganizationLayout>
