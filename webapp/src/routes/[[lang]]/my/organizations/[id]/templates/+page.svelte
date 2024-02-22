<script lang="ts">
	import {
		CollectionManager,
		CollectionManagerHeader,
		CollectionTable
	} from '$lib/collectionManager';
	import { Collections, type TemplatesResponse } from '$lib/pocketbase/types';
	import { createFieldComponent } from '$lib/recordForm/fieldSchemaToInput.svelte';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { Heading } from 'flowbite-svelte';
	import JSONSchemaInput from '../services/_partials/JSONSchemaInput.svelte';
	import Textarea from '$lib/forms/fields/textarea.svelte';

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
				options: { placeholder: 'Enter a description for the schema' }
			})
		}
	}}
	let:records
>
	<pre>{JSON.stringify(records, null, 2)}</pre>
	<CollectionManagerHeader>
		<Heading slot="title" tag="h4">Services templates</Heading>
	</CollectionManagerHeader>
	<CollectionTable {records} fields={['name']} hideActions={['share', 'delete', 'select']} />
</CollectionManager>