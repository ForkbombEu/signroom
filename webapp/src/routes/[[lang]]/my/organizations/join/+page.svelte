<script lang="ts">
	import { currentUser, pb } from '@/pocketbase/index.js';
	import {
		OrgJoinRequestsStatusOptions,
		type OrgJoinRequestsRecord,
		type OrganizationsResponse
	} from '@/pocketbase/types';
	import { m } from '@/i18n';
	import PageTop from '@/components/layout/pageTop.svelte';
	import Icon from '@/components/custom/icon.svelte';
	import { ArrowLeft, Users, UserPlus } from 'lucide-svelte';
	import SectionTitle from '@/components/custom/sectionTitle.svelte';
	import PageContent from '@/components/layout/pageContent.svelte';
	import PageCard from '@/components/layout/pageCard.svelte';
	import EmptyState from '@/components/custom/emptyState.svelte';
	import PlainCard from '@/components/custom/itemCard.svelte';
	import { CollectionManager } from '@/collections-components';
	import Dialog from '@/components/custom/dialog.svelte';
	import { Button } from '@/components/ui/button';
	import T from '@/components/custom/t.svelte';
	import { OrganizationAvatar } from '@/organizations/components';

	//

	async function sendJoinRequest(org: OrganizationsResponse) {
		pb.collection('orgJoinRequests').create({
			user: $currentUser?.id!,
			organization: org.id!,
			status: OrgJoinRequestsStatusOptions.pending,
			reminders: 0
		} satisfies OrgJoinRequestsRecord);
	}
</script>

<PageTop>
	<Button href="/my/organizations" variant="outline" size="sm">
		<Icon src={ArrowLeft} mr></Icon>
		{m.Back_to_my_organizations()}
	</Button>

	<SectionTitle tag="h3" title={m.Join_an_organization()} hideLine></SectionTitle>
</PageTop>

<PageContent>
	<PageCard>
		<CollectionManager
			collection="organizations"
			queryOptions={{
				filter: `(id = orgAuthorizations_via_organization.organization.id && orgAuthorizations_via_organization.user.id != '${$currentUser?.id}')`,
				expand: ['orgJoinRequests_via_organization'],
				perPage: 20
			}}
			subscribe="expand-collections"
			let:records
			hide={['emptyState']}
		>
			<svelte:fragment slot="emptyState">
				<EmptyState title={m.No_available_organizations_found()} icon={Users} />
			</svelte:fragment>

			<div class="space-y-2">
				{#each records as org}
					{@const sentMembershipRequest = org.expand?.orgJoinRequests_via_organization?.at(0)}

					<PlainCard let:Title let:Description>
						<svelte:fragment slot="left">
							<OrganizationAvatar organization={org} />
						</svelte:fragment>

						<div>
							<Title>{org.name}</Title>
							{#if org.description}
								<Description>
									<span class="line-clamp-2">
										{@html org.description}
									</span>
								</Description>
							{/if}
						</div>

						<div slot="right" class="shrink-0 self-start pl-8">
							{#if !sentMembershipRequest}
								<Dialog title={`${m.Send_a_request_to()} ${org.name}`}>
									<svelte:fragment slot="trigger" let:builder>
										<Button variant="outline" builders={[builder]}>
											{m.Join()}
											<Icon src={UserPlus} ml></Icon>
										</Button>
									</svelte:fragment>

									<svelte:fragment slot="content" let:closeDialog>
										<T>{m.Please_confirm_that_you_want_to_join_this_organization_()}</T>
										<div class="flex items-center justify-center gap-2 pt-4">
											<Button variant="outline" on:click={closeDialog}>
												{m.Cancel()}
											</Button>
											<Button on:click={() => sendJoinRequest(org).then(closeDialog)}>
												{m.Send_join_request()}
											</Button>
										</div>
									</svelte:fragment>
								</Dialog>
							{:else}
								<Button variant="outline" disabled>{m.Request_sent()}</Button>
							{/if}
						</div>
					</PlainCard>
				{/each}
			</div>
		</CollectionManager>
	</PageCard>
</PageContent>
