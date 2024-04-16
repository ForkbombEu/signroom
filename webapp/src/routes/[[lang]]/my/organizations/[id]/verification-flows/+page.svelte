<script lang="ts">
	import {
		Collections,
		type ServicesResponse,
		type VerificationFlowsResponse
	} from '$lib/pocketbase/types';
<<<<<<< HEAD
	import { CollectionEmptyState, CollectionManager } from '$lib/collectionManager';
	import { Plus, ArrowRight, Eye, Pencil } from 'svelte-heros-v2';
||||||| 0c96e28
	import { CollectionManager } from '$lib/collectionManager';
	import { Plus, ArrowRight, Eye, Pencil } from 'svelte-heros-v2';
=======
	import { CollectionManager } from '$lib/collectionManager';
	import { Plus, ArrowRight, Eye, Pencil, Trash } from 'svelte-heros-v2';
>>>>>>> main
	import { Button, Badge } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { m } from '$lib/i18n';
	import OrganizationLayout from '$lib/components/organizationLayout.svelte';
	import PageCard from '$lib/components/pageCard.svelte';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import PlainCard from '$lib/components/plainCard.svelte';
	import { c } from '$lib/utils/strings.js';
	import ImagePreview from '$lib/components/imagePreview.svelte';
	import DeleteRecord from '$lib/collectionManager/ui/recordActions/deleteRecord.svelte';
	import Icon from '$lib/components/icon.svelte';
	import { ProtectedOrgUI } from '$lib/rbac/index.js';

	export let data;
	let { organization } = data;

	const recordType = createTypeProp<VerificationFlowsResponse>();

	$: verificationFlowCreateUrl = `${$page.url.pathname}/create`;
	$: templatesUrl = `/my/organizations/${organization.id}/templates?filter=verification`;
	$: verificationFlowUrl = (id: string, edit = false) =>
		`${$page.url.pathname}/${id}${edit ? '/edit' : ''}`;
</script>

<OrganizationLayout org={data.organization}>
	<PageCard>
		<CollectionManager
			{recordType}
			collection={Collections.VerificationFlows}
			let:records
			initialQueryParams={{
				filter: `organization.id = '${organization.id}'`
			}}
		>
			<svelte:fragment slot="emptyState">
				<CollectionEmptyState hideCreateButton></CollectionEmptyState>
			</svelte:fragment>

			<SectionTitle
				tag="h5"
				title={m.Verification_flows()}
				description={m.verification_flows_description()}
			>
				<svelte:fragment slot="right">
					<div class="flex gap-2">
						<Button href={templatesUrl} outline class="shrink-0">
							{m.Verification_templates()}
							<ArrowRight size="20" class="ml-1" />
						</Button>
						<Button href={verificationFlowCreateUrl} class="shrink-0">
							{m.New_verification_flow()}
							<Plus size="20" class="ml-1" />
						</Button>
					</div>
				</svelte:fragment>
			</SectionTitle>

			{#if records.length > 0}
				<div class="space-y-4">
					{#each records as record}
						<PlainCard>
							<div class="flex items-center gap-4">
								<ImagePreview src={record.logo} size="w-[50px] h-[50px]" hideHelpText />
								<div>
									<div class="flex gap-2 items-center">
										<p class="text-primary-700 font-semibold">{c(record.name)}</p>
										<Badge color="green">{m.Active()}</Badge>
									</div>
									{#if record.description}
										<p class="text-sm text-gray-500">{record.description}</p>
									{/if}
								</div>
							</div>

							<svelte:fragment slot="right">
								<div class="flex items-center gap-2">
									<Button outline size="sm" href={verificationFlowUrl(record.id)}>
										{m.View()}
										<Icon src={Eye} ml></Icon>
									</Button>

									<ProtectedOrgUI orgId={organization.id} roles={['admin', 'owner']}>
										<Button outline size="sm" href={verificationFlowUrl(record.id, true)}>
											{m.Edit()}
											<Icon src={Pencil} ml></Icon>
										</Button>

										<DeleteRecord {record} let:openModal>
											<Button outline size="sm" on:click={openModal}>
												<Icon src={Trash} />
											</Button>
										</DeleteRecord>
									</ProtectedOrgUI>
								</div>
							</svelte:fragment>
						</PlainCard>
					{/each}
				</div>
			{/if}
		</CollectionManager>
	</PageCard>
</OrganizationLayout>
