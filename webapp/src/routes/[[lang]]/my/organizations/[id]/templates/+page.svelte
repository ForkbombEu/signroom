<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { CollectionEmptyState, CollectionManager, DeleteRecord } from '$lib/collectionManager';
	import {
		Collections,
		TemplatesTypeOptions,
		type TemplatesResponse,
		type TemplatesRecord
	} from '$lib/pocketbase/types';
	import { createFieldComponent } from '$lib/recordForm/fieldSchemaToInput.svelte';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { Badge, Button } from 'flowbite-svelte';
	import JSONSchemaInput from './_partials/JSONSchemaInput.svelte';
	import Textarea from '$lib/forms/fields/textarea.svelte';
	import { m } from '$lib/i18n';

	import { objectSchemaValidator } from '$lib/jsonSchema/types';

	import {
		objectSchemaToCredentialSubject,
		flattenCredentialSubjectProperties
	} from '@api/download-microservices/utils/credential-subject';

	import OrganizationLayout from '$lib/components/organizationLayout.svelte';
	import PageCard from '$lib/components/pageCard.svelte';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import { ArrowLeft, Pencil, Plus, Trash } from 'svelte-heros-v2';
	import Icon from '$lib/components/icon.svelte';
	import PlainCard from '$lib/components/plainCard.svelte';
	import TemplateForm from './_partials/templateForm.svelte';
	import PortalWrapper from '$lib/components/portalWrapper.svelte';
	import Drawer from '$lib/components/drawer.svelte';
	import { createToggleStore } from '$lib/components/utils/toggleStore';
	import { page } from '$app/stores';
	import { ProtectedOrgUI } from '$lib/rbac';
	import { templatesColors } from '$lib/utils/colors';
	import { Array as A, Effect, Option as O, pipe } from 'effect';

	//

	export let data;
	let { organization } = data;

	const recordType = createTypeProp<TemplatesResponse>();

	//

	type TemplateFilter = TemplatesTypeOptions | null;
	let templateFilter: TemplateFilter = null;

	$: templateFilter = $page.url.searchParams.get('filter') as TemplateFilter;

	$: backUrl = calcBackUrl(templateFilter);

	$: backText = choice(
		templateFilter,
		m.Back_to_issuance_flows(),
		m.Back_to_issuance_flows(),
		m.Back_to_verification_flows(),
		''
	);

	$: title = choice(
		templateFilter,
		m.Credential_templates(),
		m.Authorization_templates(),
		m.Verification_templates(),
		m.Templates()
	);

	$: description = choice(
		templateFilter,
		m.templates_description_credential(),
		m.templates_description_authorization(),
		m.templates_description_verification(),
		m.templates_description()
	);

	$: button = choice(
		templateFilter,
		m.New_credential_template(),
		m.New_authorization_template(),
		m.New_verification_template(),
		m.New_template()
	);

	function choice<T = unknown>(
		templateFilter: TemplateFilter,
		issuance: T,
		authorization: T,
		verification: T,
		def: T
	) {
		switch (templateFilter) {
			case TemplatesTypeOptions.issuance: {
				return issuance;
			}
			case TemplatesTypeOptions.authorization: {
				return authorization;
			}
			case TemplatesTypeOptions.verification: {
				return verification;
			}
			default: {
				return def;
			}
		}
	}

	//

	function calcBackUrl(templateFilter: TemplateFilter): string {
		const baseUrl = (route: string) => `/my/organizations/${organization.id}/${route}`;

		return choice(
			templateFilter,
			baseUrl('credential-issuances'),
			baseUrl('credential-issuances'),
			baseUrl('verification-flows'),
			''
		);
	}

	function calcPbFilter(templateFilter: TemplateFilter): string {
		const organizationFilter = `organization.id = '${organization.id}'`;
		const typeFilter = calcPbTemplateTypeFilter(templateFilter);
		if (typeFilter) return `${organizationFilter} && ${typeFilter}`;
		else return organizationFilter;
	}

	function calcPbTemplateTypeFilter(templateFilter: TemplateFilter): string {
		const type = (type: TemplatesTypeOptions) => `type = '${type}'`;

		return choice(
			templateFilter,
			type(TemplatesTypeOptions.issuance),
			type(TemplatesTypeOptions.authorization),
			type(TemplatesTypeOptions.verification),
			''
		);
	}

	//

	function getTemplatePropertyList(schemas: Array<unknown | undefined>) {
		return pipe(
			schemas,
			A.map((schema) =>
				pipe(
					Effect.try(() =>
						pipe(
							objectSchemaValidator.parse(schema),
							objectSchemaToCredentialSubject,
							flattenCredentialSubjectProperties,
							A.map(([credentialName, _]) => credentialName)
						)
					),
					Effect.orElseSucceed(() => [] as string[]),
					Effect.runSync
				)
			),
			A.flatten,
			A.join(', ')
		);
	}

	//

	let templateFormId: string | undefined = undefined;
	let templateFormInitialData: TemplatesRecord | undefined = undefined;

	$: hideDrawer = createToggleStore(true);
</script>

<OrganizationLayout org={data.organization}>
	<PageCard>
		{#if templateFilter}
			<Button href={backUrl} outline>
				<ArrowLeft size="20" class="mr-2"></ArrowLeft>
				{backText}
			</Button>
		{/if}

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
			<svelte:fragment slot="emptyState">
				<CollectionEmptyState hideCreateButton></CollectionEmptyState>
			</svelte:fragment>

			<SectionTitle tag="h5" {title} {description}>
				<svelte:fragment slot="right">
					<Button id="newTemplate" on:click={hideDrawer.off}>
						{button}
						<Icon src={Plus} ml />
					</Button>
				</svelte:fragment>
			</SectionTitle>

			<div class="space-y-4">
				{#each records as template}
					{@const propertyList = getTemplatePropertyList([
						template.schema,
						template.schema_secondary
					])}

					<PlainCard let:Title let:Description>
						<div class="flex items-center gap-2">
							<Title>{template.name}</Title>
							<Badge color={templatesColors[template.type]}>
								{template.type}
							</Badge>
							{#if template.public}
								<Badge color="dark">{m.Public()}</Badge>
							{/if}
						</div>
						{#if template.description}
							<Description>{template.description}</Description>
						{/if}

						<p class="mt-2 w-fit rounded-md bg-gray-100 px-2 py-1 font-mono text-xs text-gray-500">
							{#if Boolean(propertyList)}
								Properties: {propertyList}
							{:else}
								{m.No_properties_found()}
							{/if}
						</p>

						<svelte:fragment slot="right">
							<div class="flex gap-2">
								<ProtectedOrgUI orgId={organization.id} roles={['admin', 'owner']}>
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

									<DeleteRecord record={template} let:openModal>
										<Button outline on:click={openModal}>
											<Icon src={Trash} />
										</Button>
									</DeleteRecord>
								</ProtectedOrgUI>
							</div>
						</svelte:fragment>
					</PlainCard>
				{/each}
			</div>
		</CollectionManager>
	</PageCard>
</OrganizationLayout>

<PortalWrapper>
	<Drawer width="w-[800px]" placement="right" bind:hidden={$hideDrawer} title={button}>
		{@const defaultTemplateType = choice(
			templateFilter,
			TemplatesTypeOptions.issuance,
			TemplatesTypeOptions.authorization,
			TemplatesTypeOptions.verification,
			undefined
		)}
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
