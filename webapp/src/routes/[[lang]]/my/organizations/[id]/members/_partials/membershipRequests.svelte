<script lang="ts">
	import { CollectionManager } from '@/collections-components';
	import { pb } from '@/pocketbase/index.js';
	import {
		OrgJoinRequestsStatusOptions,
		type OrgJoinRequestsRecord,
		type OrgJoinRequestsResponse,
		type OrganizationsResponse
	} from '@/pocketbase/types';
	import { m } from '@/i18n';
	import { UserPlus, CircleOffIcon } from 'lucide-svelte';
	import PlainCard from '@/components/custom/itemCard.svelte';
	import { getUserDisplayName } from '@/pocketbase/utils';
	import UserAvatar from '@/components/custom/userAvatar.svelte';
	import Icon from '@/components/custom/icon.svelte';
	import SectionTitle from '@/components/custom/sectionTitle.svelte';
	import { PageCard } from '@/components/layout';
	import { Button } from '@/components/ui/button';
	import Dialog from '@/components/custom/dialog.svelte';
	import { toast } from 'svelte-sonner';
	import Trash from 'lucide-svelte/icons/trash';
	import X from 'lucide-svelte/icons/x';

	//

	export let organization: OrganizationsResponse;

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
</script>

<CollectionManager
	collection="orgJoinRequests"
	queryOptions={{
		filter: `organization.id = "${organization.id}" && status = "${pending}"`,
		expand: ['user']
	}}
	let:records
	hide={['emptyState']}
>
	{#if records.length}
		<PageCard>
			<SectionTitle
				tag="h4"
				title={m.Pending_membership_requests()}
				description={m.pending_membership_requests_description()}
			/>

			<div class="space-y-2">
				{#each records as request}
					{@const user = request.expand?.user}
					{#if user}
						<PlainCard>
							<UserAvatar slot="left" {user} />

							{getUserDisplayName(user)}

							<svelte:fragment slot="right">
								<div class="space-x-1">
									<Button
										variant="outline"
										on:click={() =>
											updateRequestStatus(request, accepted)
												.then(() => toast.success(m.Request_accepted_sucessfully()))
												.catch(() =>
													toast.error(m.An_error_occurred_while_handling_membership_request())
												)}
									>
										{m.Accept()}
										<Icon src={UserPlus} ml />
									</Button>

									<Dialog title={m.Warning()}>
										<svelte:fragment slot="trigger" let:builder>
											<Button variant="outline" builders={[builder]}>
												{m.Decline()}
												<Icon src={CircleOffIcon} ml />
											</Button>
										</svelte:fragment>

										<svelte:fragment slot="content" let:closeDialog>
											<p>{m.decline_membership_request_warning()}</p>
											<div class="flex items-center justify-center gap-2">
												<Button variant="outline" on:click={closeDialog}>
													{m.Cancel()}
													<Icon src={X} ml />
												</Button>
												<Button
													variant="destructive"
													on:click={() =>
														updateRequestStatus(request, rejected)
															.then(closeDialog)
															.then(() => toast.info(m.Membership_request_declined_successfully()))}
												>
													{m.decline_membership_request()}
													<Icon src={Trash} ml />
												</Button>
											</div>
										</svelte:fragment>
									</Dialog>
								</div>
							</svelte:fragment>
						</PlainCard>
					{/if}
				{/each}
			</div>
		</PageCard>
	{/if}
</CollectionManager>
