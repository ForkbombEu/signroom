<script lang="ts">
	import { OrgRoles } from '@/organizations';
	import { currentUser, pb } from '@/pocketbase/index.js';
	import { invalidateAll } from '$app/navigation';
	import { m } from '@/i18n';
	import EmptyState from '@/components/custom/emptyState.svelte';
	import PlainCard from '@/components/custom/itemCard.svelte';
	import CollectionManager from '@/collections-components/manager/collectionManager.svelte';
	import { Button } from '@/components/ui/button';
	import { Badge } from '@/components/ui/badge';
	import Avatar from '@/components/custom/avatar.svelte';
	import T from '@/components/custom/t.svelte';
	import { PageTop, PageCard, PageContent } from '@/components/layout';
	import SectionTitle from '@/components/custom/sectionTitle.svelte';
	import Icon from '@/components/custom/icon.svelte';
	import { Plus, UserPlus, Cog, Puzzle, Undo2, X, Check } from 'lucide-svelte';
	import { capitalize } from '@/utils/other';
	import A from '@/components/custom/a.svelte';
	import { toast } from 'svelte-sonner';

	//

	const { ADMIN, OWNER } = OrgRoles;

	/* Org invites */

	function updateInvite(inviteId: string, action: 'accept' | 'decline') {
		pb.send(`/organizations/invites/${action}`, {
			method: 'POST',
			body: {
				inviteId
			}
		})
			.then(() => {
				if (action == 'accept') toast.success(m.Invite_accepted_succesfully());
				else if (action == 'decline') toast.info(m.Invitation_declined());
			})
			.catch(() => {
				toast.error(m.An_error_occurred_while_processing_your_request());
			});
	}

	/* Org membership requests */

	async function deleteJoinRequest(requestId: string) {
		await pb.collection('orgJoinRequests').delete(requestId);
		invalidateAll();
	}
</script>

<PageTop>
	<SectionTitle
		tag="h3"
		title={m.My_organizations()}
		description={m.organzations_page_description()}
	/>
</PageTop>

<PageContent>
	<CollectionManager
		collection="org_invites"
		queryOptions={{
			expand: ['organization'],
			filter: `user.id = "${$currentUser?.id ?? ''}" && declined = false`
		}}
		hide={['emptyState']}
		let:records
	>
		{#if records.length > 0}
			<PageCard>
				<SectionTitle title={m.organization_invites()} />

				{#each records as record}
					<PlainCard>
						{record.expand?.organization?.name}
						<svelte:fragment slot="right">
							<Button variant="outline" on:click={() => updateInvite(record.id, 'accept')}>
								{m.accept_invite()}<Icon src={Check} ml />
							</Button>
							<Button variant="outline" on:click={() => updateInvite(record.id, 'decline')}>
								{m.decline_invite()}<Icon src={X} ml />
							</Button>
						</svelte:fragment>
					</PlainCard>
				{/each}
			</PageCard>
		{/if}
	</CollectionManager>

	<CollectionManager
		collection="orgJoinRequests"
		queryOptions={{
			expand: ['organization'],
			filter: `user.id = "${$currentUser?.id}"`
		}}
		hide={['emptyState']}
		let:records
	>
		{#if records.length}
			<PageCard>
				<SectionTitle title={m.Your_membership_requests()}></SectionTitle>

				<div class="space-y-4">
					{#each records as request}
						{@const organization = request.expand?.organization}
						{#if organization}
							{@const avatarUrl = pb.files.getUrl(organization, organization.avatar)}
							<PlainCard>
								<Avatar slot="left" src={avatarUrl}></Avatar>

								<div class="flex items-center space-x-2">
									<T>{request.expand?.organization?.name}</T>
									<Badge variant="default">{m.Pending()}</Badge>
								</div>

								<Button
									slot="right"
									variant="outline"
									on:click={() => {
										deleteJoinRequest(request.id);
									}}
								>
									{m.Undo_request()}
									<Icon src={Undo2} ml></Icon>
								</Button>
							</PlainCard>
						{/if}
					{/each}
				</div>
			</PageCard>
		{/if}
	</CollectionManager>

	<PageCard>
		<SectionTitle title={m.Your_organizations()}>
			<svelte:fragment slot="right">
				<Button size="sm" variant="outline" class="shrink-0 !px-4" href="/my/organizations/join">
					<span class="ml-1"> {m.Join_an_organization()} </span>
					<Icon src={UserPlus} ml />
				</Button>
				<Button size="sm" class="shrink-0 !px-4" href="/my/organizations/create">
					<span class="ml-1"> {m.Create_a_new_organization()} </span>
					<Icon src={Plus} ml />
				</Button>
			</svelte:fragment>
		</SectionTitle>

		<CollectionManager
			collection="orgAuthorizations"
			queryOptions={{
				expand: ['organization', 'role'],
				filter: `user.id = "${$currentUser?.id}"`
			}}
			let:records
		>
			<svelte:fragment slot="emptyState">
				<EmptyState title={m.You_havent_added_any_organizations_yet_()} icon={Puzzle} />
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
										<Badge variant="secondary">{capitalize(role.name)}</Badge>
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
											variant="outline"
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
