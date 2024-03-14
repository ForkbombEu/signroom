<script lang="ts">
	import {
		CollectionManager,
		CollectionManagerHeader,
		CollectionTable
	} from '$lib/collectionManager';
	import { Collections, type TemplatesResponse } from '$lib/pocketbase/types';
	import { createFieldComponent } from '$lib/recordForm/fieldSchemaToInput.svelte';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { Heading, TableBodyCell as Td } from 'flowbite-svelte';
	import JSONSchemaInput from '../services/_partials/JSONSchemaInput.svelte';
	import Textarea from '$lib/forms/fields/textarea.svelte';
	import { m } from '$lib/i18n';

	export let data;
	let { organization } = data;

	const recordType = createTypeProp<TemplatesResponse>();
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
		<Heading slot="title" tag="h4">{m.Credential_templates()}</Heading>
	</CollectionManagerHeader>

	<CollectionTable {records} fields={['name']} hideActions={['share', 'delete', 'select', 'edit']}>
		<svelte:fragment let:record>
			<div class="max-h-[200px] overflow-scroll bg-gray-100 p-3 rounded-lg">
				<pre>{JSON.stringify(record.schema, null, 2)}</pre>
			</div>
		</svelte:fragment>
	</CollectionTable>
</CollectionManager>
