<script lang="ts">
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import { FieldWrapper } from '$lib/forms';
	import { getFormContext } from '$lib/forms/form.svelte';
	import { JSONSchemaField, JSONSchemaEditor } from 'json-schema-builder-svelte';
	import { Alert, P, TabItem, Tabs } from 'flowbite-svelte';

	export let field: string;
	export let label = '';

	const { superform } = getFormContext();
	const { value } = formFieldProxy(superform, field);

	const openEditor = $value === '';
	const openPlain = $value !== '';
</script>

<FieldWrapper {field} {label}>
	<Tabs style="full">
		<TabItem open={openPlain} title="Plain schema">
			<Alert color="yellow" border class="!p-3 text-xs mb-4">
				If the schema was not created with the Visual Editor, changing mode will alter some fields
				<strong>with breaking changes!</strong>.
			</Alert>
			<JSONSchemaField bind:schema={$value} />
		</TabItem>
		<TabItem open={openEditor} title="Visual editor">
			<div class="space-y-6">
				<JSONSchemaEditor bind:schema={$value} hide={['title', 'description']} />
			</div>
		</TabItem>
	</Tabs>
</FieldWrapper>
