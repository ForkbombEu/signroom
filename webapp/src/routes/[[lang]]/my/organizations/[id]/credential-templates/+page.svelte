<script lang="ts">
	import { CollectionManager } from '$lib/collectionManager';
	import {
		Collections,
		TemplatesTypeOptions,
		type TemplatesResponse,
		type TemplatesRecord
	} from '$lib/pocketbase/types';
	import { createFieldComponent } from '$lib/recordForm/fieldSchemaToInput.svelte';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { Badge, Button } from 'flowbite-svelte';
	import JSONSchemaInput from '../credential-issuances/_partials/JSONSchemaInput.svelte';
	import Textarea from '$lib/forms/fields/textarea.svelte';
	import { m } from '$lib/i18n';

	import { objectSchemaValidator } from '$lib/jsonSchema/types';
	import {
		objectSchemaToCredentialSubject,
		flattenCredentialSubjectProperties
	} from '@api/downloadCredentialIssuer/utils';
	import OrganizationLayout from '$lib/components/organizationLayout.svelte';
	import PageCard from '$lib/components/pageCard.svelte';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import { ArrowLeft, Eye, Pencil, Plus } from 'svelte-heros-v2';
	import Icon from '$lib/components/icon.svelte';
	import PlainCard from '$lib/components/plainCard.svelte';
	import TemplateForm from './_partials/templateForm.svelte';
	import PortalWrapper from '$lib/components/portalWrapper.svelte';
	import Drawer from '$lib/components/drawer.svelte';
	import { createToggleStore } from '$lib/components/utils/toggleStore';
	import { page } from '$app/stores';

	//

	export let data;
	let { organization } = data;

	const recordType = createTypeProp<TemplatesResponse>();

	//

	type TemplateFilter = 'issuance' | 'verification' | null;
	let templateFilter: TemplateFilter = null;

	$: templateFilter = $page.url.searchParams.get('filter') as TemplateFilter;

	$: backUrl = `/my/organizations/${organization.id}/${
		templateFilter == 'issuance' ? 'credential-issuances' : 'verification-flows'
	}`;

	$: backText =
		templateFilter == 'issuance' ? m.Back_to_issuance_flows() : m.Back_to_verification_flows();

	function calcPbFilter(templateFilter: TemplateFilter): string {
		const organizationFilter = `organization.id = '${organization.id}'`;
		const typeFilter = calcPbTemplateTypeFilter(templateFilter);
		if (typeFilter) return `${organizationFilter} && ${typeFilter}`;
		else return organizationFilter;
	}

	function calcPbTemplateTypeFilter(templateFilter: TemplateFilter): string {
		if (!templateFilter) return '';
		else if (templateFilter == 'issuance')
			return `type = '${TemplatesTypeOptions.authorization}' || type = '${TemplatesTypeOptions.issuance}'`;
		else return `type = '${TemplatesTypeOptions.verification}'`;
	}

	//

	function getTemplatePropertyList(schema: any) {
		try {
			const objectSchema = objectSchemaValidator.parse(schema);
			const credentialSubject = objectSchemaToCredentialSubject(objectSchema);
			return flattenCredentialSubjectProperties(credentialSubject);
		} catch (e) {
			return undefined;
		}
	}

	//

	let templateFormId: string | undefined = undefined;
	let templateFormInitialData: TemplatesRecord | undefined = undefined;

	$: hideDrawer = createToggleStore(true);
</script>

<OrganizationLayout org={data.organization}>
	<PageCard>
		<CollectionManager
			{recordType}
			collection={Collections.Templates}
			initialQueryParams={{
				filter: calcPbFilter(templateFilter),
				sort: 'type'
			}}
			formSettings={{
				hide: { organization: organization.id },
				components: {
					schema: createFieldComponent(JSONSchemaInput),
					description: createFieldComponent(Textarea, {
						options: { placeholder: m.Enter_a_description_for_the_schema() }
					})
				}
			}}
			let:records
		>
			{#if templateFilter}
				<Button href={backUrl} outline>
					<ArrowLeft size="20" class="mr-2"></ArrowLeft>
					{backText}
				</Button>
			{/if}

			<SectionTitle tag="h5" title={m.Templates()}>
				<svelte:fragment slot="right">
					<Button on:click={hideDrawer.off}>
						{m.New_credential_template()}
						<Icon src={Plus} ml />
					</Button>
				</svelte:fragment>
			</SectionTitle>

			<div class="space-y-4">
				{#each records as template}
					{@const propertyList = getTemplatePropertyList(template.schema)
						?.map((e) => e[0])
						.join(', ')}

					<PlainCard let:Title let:Description>
						<div class="flex items-center gap-2">
							<Title>{template.name}</Title>
							<Badge color="dark">{template.type}</Badge>
						</div>
						{#if template.description}
							<Description>{template.description}</Description>
						{/if}

						{#if propertyList}
							<p class="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded-md mt-2">
								{propertyList}
							</p>
						{:else}
							<p class="text-gray-300">Template parsing error</p>
						{/if}

						<svelte:fragment slot="right">
							<div class="flex gap-2">
								<Button outline disabled>
									View
									<Icon src={Eye} ml></Icon>
								</Button>

								<Button
									outline
									on:click={() => {
										templateFormId = template.id;
										templateFormInitialData = template;
										hideDrawer.off();
									}}
								>
									Edit
									<Icon src={Pencil} ml></Icon>
								</Button>
							</div>
						</svelte:fragment>
					</PlainCard>
				{/each}
			</div>
		</CollectionManager>
	</PageCard>
</OrganizationLayout>

<PortalWrapper>
	<Drawer
		width="w-[700px]"
		placement="right"
		bind:hidden={$hideDrawer}
		title={m.Create_new_Template()}
	>
		{@const defaultTemplateType =
			templateFilter == 'issuance'
				? TemplatesTypeOptions.issuance
				: TemplatesTypeOptions.verification}

		<div class="p-8">
			<TemplateForm
				templateId={templateFormId}
				initialData={{
					organization: organization.id,
					type: defaultTemplateType,
					...templateFormInitialData
				}}
				on:success={() => {
					templateFormId = undefined;
					templateFormInitialData = undefined;
					hideDrawer.on();
				}}
			/>
		</div>
	</Drawer>
</PortalWrapper>
