<script lang="ts">
	import {
		CollectionManager,
		CollectionManagerHeader,
		CollectionTable
	} from '$lib/collectionManager';
	import { Collections, type TemplatesResponse } from '$lib/pocketbase/types';
	import { createFieldComponent } from '$lib/recordForm/fieldSchemaToInput.svelte';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { Button, Heading, P, TableHeadCell } from 'flowbite-svelte';
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
	import CreateRecord from '$lib/collectionManager/ui/recordActions/createRecord.svelte';
	import { ArrowLeft, Eye, Pencil, Plus } from 'svelte-heros-v2';
	import Icon from '$lib/components/icon.svelte';
	import PlainCard from '$lib/components/plainCard.svelte';
	import Description from '$lib/components/table/cells/description.svelte';
	import EditRecord from '$lib/collectionManager/ui/recordActions/editRecord.svelte';

	//

	export let data;
	let { organization } = data;

	const recordType = createTypeProp<TemplatesResponse>();

	$: backUrl = `/my/organizations/${organization.id}/credential-issuances`;

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
</script>

<OrganizationLayout org={data.organization}>
	<PageCard>
		<CollectionManager
			{recordType}
			collection={Collections.Templates}
			initialQueryParams={{
				filter: `organization.id = '${organization.id}'`
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
			<Button href={backUrl} outline>
				<ArrowLeft size="20" class="mr-2"></ArrowLeft>
				{m.Back_to_issuance_flows()}
			</Button>

			<SectionTitle tag="h5" title={m.Credential_templates()}>
				<svelte:fragment slot="right">
					<div class="flex gap-2">
						<CreateRecord>
							<svelte:fragment slot="button" let:openModal>
								<Button on:click={openModal} class="shrink-0">
									{m.New_credential_template()}
									<Icon src={Plus} ml />
								</Button>
							</svelte:fragment>
						</CreateRecord>
					</div>
				</svelte:fragment>
			</SectionTitle>

			<div class="space-y-4">
				{#each records as template}
					{@const propertyList = getTemplatePropertyList(template.schema)
						?.map((e) => e[0])
						.join(', ')}

					<PlainCard let:Title let:Description>
						<Title>{template.name}</Title>
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
								<Button outline>
									View
									<Icon src={Eye} ml></Icon>
								</Button>

								<EditRecord record={template} let:openModal formSettings={{ dataType: 'json' }}>
									<Button outline on:click={openModal}>
										Edit
										<Icon src={Pencil} ml></Icon>
									</Button>
								</EditRecord>
							</div>
						</svelte:fragment>
					</PlainCard>
				{/each}
			</div>
		</CollectionManager>
	</PageCard>
</OrganizationLayout>
