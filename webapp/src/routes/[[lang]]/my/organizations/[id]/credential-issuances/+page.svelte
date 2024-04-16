<script lang="ts">
	import { Collections, TemplatesTypeOptions, type ServicesResponse } from '$lib/pocketbase/types';
	import { CollectionManager } from '$lib/collectionManager';
	import { Plus, ArrowRight, Eye, Pencil } from 'svelte-heros-v2';
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

	export let data;
	let { organization } = data;

	const recordType = createTypeProp<ServicesResponse>();

	$: createIssuanceUrl = `${$page.url.pathname}/create`;

	$: templatesUrl = (type: TemplatesTypeOptions) =>
		`/my/organizations/${organization.id}/templates?filter=${type}`;

	$: issuanceFlowUrl = (id: string, edit = false) =>
		`${$page.url.pathname}/${id}${edit ? '/edit' : ''}`;
</script>

<OrganizationLayout org={data.organization}>
	<PageCard>
		<CollectionManager
			{recordType}
			collection={Collections.Services}
			let:records
			initialQueryParams={{
				filter: `organization.id = '${organization.id}'`
			}}
		>
			<SectionTitle
				tag="h5"
				title={m.Issuance_flows()}
				description={m.issuance_flows_description()}
			>
				<svelte:fragment slot="right">
					<div class="flex gap-2">
						<Button
							href={templatesUrl(TemplatesTypeOptions.authorization)}
							outline
							class="shrink-0"
						>
							{m.Authorization_templates()}
							<ArrowRight size="20" class="ml-1" />
						</Button>

						<Button href={templatesUrl(TemplatesTypeOptions.issuance)} outline class="shrink-0">
							{m.Credential_templates()}
							<ArrowRight size="20" class="ml-1" />
						</Button>

						<Button href={createIssuanceUrl} class="shrink-0">
							{m.New_issuance_flow()}
							<Plus size="20" class="ml-1" />
						</Button>
					</div>
				</svelte:fragment>
			</SectionTitle>

			{#if records.length > 0}
				<div class="space-y-4">
					{#each records as record}
						<PlainCard>
							<ImagePreview slot="left" src={record.logo} size="w-[50px] h-[50px]" hideHelpText />

							<div class="flex gap-2 items-center">
								<p class="text-primary-700 font-semibold">{c(record.display_name)}</p>
								<Badge color="green">{m.Active()}</Badge>
							</div>
							{#if record.description}
								<p class="text-sm text-gray-500">{record.description}</p>
							{/if}

							<svelte:fragment slot="right">
								<div class="space-x-1">
									<Button outline size="sm" href={issuanceFlowUrl(record.id)}>
										{m.View()}
										<Eye size="20" class="ml-2" />
									</Button>
									<Button outline size="sm" href={issuanceFlowUrl(record.id, true)}>
										{m.Edit()}
										<Pencil size="20" class="ml-2" />
									</Button>
								</div>
							</svelte:fragment>
						</PlainCard>
					{/each}
				</div>
			{/if}
		</CollectionManager>
	</PageCard>
</OrganizationLayout>
