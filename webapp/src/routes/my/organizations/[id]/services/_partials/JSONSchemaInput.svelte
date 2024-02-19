<script lang="ts">
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';
	import { FieldWrapper } from '$lib/forms';
	import { JSONSchemaField, JSONSchemaBuilder } from 'json-schema-builder-svelte';
	import { Alert, TabItem, Tabs } from 'flowbite-svelte';
	import type { UnwrapEffects } from 'sveltekit-superforms';

	type T = $$Generic<AnyZodObject>;

	export let field: string;
	export let label = '';
	export let superform: SuperForm<UnwrapEffects<T>, any>;

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
				<JSONSchemaBuilder bind:schema={$value} />
			</div>
		</TabItem>
	</Tabs>
</FieldWrapper>
