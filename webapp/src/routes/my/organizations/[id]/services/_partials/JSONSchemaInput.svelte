<script lang="ts">
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import { FieldWrapper } from '$lib/forms';
	import { getFormContext } from '$lib/forms/form.svelte';
	import { JSONSchemaField, JSONSchemaEditor } from 'json-schema-builder-svelte';
	import { TabItem, Tabs } from 'flowbite-svelte';

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
			<JSONSchemaField bind:schema={$value}></JSONSchemaField>
		</TabItem>
		<TabItem open={openEditor} title="Visual editor">
			<div class="space-y-6">
				<JSONSchemaEditor bind:schema={$value} hide={['title', 'description']}></JSONSchemaEditor>
			</div>
		</TabItem>
	</Tabs>
</FieldWrapper>
