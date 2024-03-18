<script lang="ts">
	import {
		CollectionManager,
		CollectionManagerHeader,
		CollectionTable
	} from '$lib/collectionManager';
	import { Collections, type TemplatesResponse } from '$lib/pocketbase/types';
	import { createFieldComponent } from '$lib/recordForm/fieldSchemaToInput.svelte';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { Heading, P, TableHeadCell } from 'flowbite-svelte';
	import JSONSchemaInput from '../credential-issuances/_partials/JSONSchemaInput.svelte';
	import Textarea from '$lib/forms/fields/textarea.svelte';
	import { m } from '$lib/i18n';

	import { objectSchemaValidator } from '$lib/jsonSchema/types';
	import {
		objectSchemaToCredentialSubject,
		flattenCredentialSubjectProperties
	} from '@api/downloadCredentialIssuer/utils';

	//

	export let data;
	let { organization } = data;

	const recordType = createTypeProp<TemplatesResponse>();

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
	<CollectionManagerHeader>
		<div slot="title" class="space-y-1">
			<Heading tag="h4">{m.Credential_templates()}</Heading>
		</div>
	</CollectionManagerHeader>

	<CollectionTable {records} fields={['name']} hideActions={['share', 'delete', 'select', 'edit']}>
		<svelte:fragment slot="header">
			<TableHeadCell>Properties</TableHeadCell>
		</svelte:fragment>

		<svelte:fragment let:record>
			{@const propertyList = getTemplatePropertyList(record.schema)}
			{#if propertyList}
				<div class="max-h-[200px] overflow-scroll rounded-lg font-mono">
					<ul class="list-disc list-inside">
						{#each propertyList as [propertyName, property]}
							<li>
								{propertyName}
								{#if property.mandatory}
									<span class="text-gray-300">[required]</span>
								{/if}
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</svelte:fragment>
	</CollectionTable>
</CollectionManager>
