<script lang="ts">
	import { getCollectionSchema } from '$lib/pocketbase/schema/index.js';
	import { Collections } from '$lib/pocketbase/types.js';
	import { fieldsSchemaToZod } from '$lib/pocketbaseToZod/index.js';
	import { Form, createForm, Input, Textarea, SubmitButton, Checkbox, Relations } from '$lib/forms';
	import RelationsManager from '$lib/components/relationsManager.svelte';

	export let data;

	const serviceSchema = fieldsSchemaToZod(getCollectionSchema(Collections.Services)!.schema);

	const superform = createForm(
		serviceSchema,
		(e) => {
			console.log(e);
		},
		{
			organization: data.organization.id
		}
	);
</script>

<Form {superform}>
	<Input field="name" placeholder="Service name" />
	<Textarea field="description" placeholder="Service name" />
	<Checkbox field="add_ons">Use add ons</Checkbox>
	<Relations field="issuer"></Relations>
	<div class="flex justify-end">
		<SubmitButton>Create service</SubmitButton>
	</div>
</Form>
