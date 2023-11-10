<script lang="ts">
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';
	import { FieldWrapper } from '$lib/forms';
	import { getFormContext } from '$lib/forms/form.svelte';
	import {
		JSONSchemaField,
		JSONSchemaEditor,
		type JSONSchemaInput
	} from 'json-schema-builder-svelte';
	import { Alert, TabItem, Tabs } from 'flowbite-svelte';
	import { nanoid } from 'nanoid';
	import type { ZodValidation } from 'sveltekit-superforms';

	export let field: string;
	export let label = '';
	export let mode: 'create' | 'edit' = 'create';
	
	type T = $$Generic<AnyZodObject>;
	export let superform:SuperForm<ZodValidation<T>, any>;

	const { value } = formFieldProxy(superform, field);

	const openEditor = $value === '';
	const openPlain = $value !== '';

	let initialSchemaInput: Partial<JSONSchemaInput> = {};
	if (mode == 'create') initialSchemaInput = { $id: `didroom-schema-${nanoid(5)}` };
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
				<JSONSchemaEditor
					bind:schema={$value}
					hide={['id', 'title', 'description']}
					{initialSchemaInput}
				/>
			</div>
		</TabItem>
	</Tabs>
</FieldWrapper>
