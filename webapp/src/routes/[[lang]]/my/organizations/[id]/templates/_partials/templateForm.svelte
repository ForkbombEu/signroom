<script lang="ts">
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import { Checkbox, Form, createForm, Select as SelectInput } from '$lib/forms';
	import Input from '$lib/forms/fields/input.svelte';
	import Textarea from '$lib/forms/fields/textarea.svelte';
	import { m } from '$lib/i18n';
	import { pb } from '$lib/pocketbase';
	import { getCollectionSchema } from '$lib/pocketbase/schema';
	import {
		Collections,
		TemplatesTypeOptions,
		type TemplatesResponse,
		type TemplatesRecord
	} from '$lib/pocketbase/types';
	import { fieldsSchemaToZod } from '$lib/pocketbaseToZod';
	import { Hr, Label, type SelectOptionType, Select } from 'flowbite-svelte';
	import JSONSchemaInput from './JSONSchemaInput.svelte';
	import SubmitButton from '$lib/forms/submitButton.svelte';
	import FormError from '$lib/forms/formError.svelte';
	import { createEventDispatcher } from 'svelte';
	import { templatePresetOptions, type TemplatePreset } from './templatePresets';

	export let templateId: string | undefined = undefined;
	export let initialData: Partial<TemplatesRecord> = {
		type: TemplatesTypeOptions.issuance
	};

	let schema = fieldsSchemaToZod(getCollectionSchema(Collections.Templates)!.schema);

	let dispatch = createEventDispatcher<{ success: TemplatesResponse }>();

	let superform = createForm(
		schema,
		async (e) => {
			let record: TemplatesResponse;
			if (templateId) {
				record = await pb.collection('templates').update(templateId, e.form.data);
			} else {
				record = await pb.collection('templates').create(e.form.data);
			}
			dispatch('success', record);
		},
		initialData,
		{
			dataType: 'json'
		}
	);

	const { form } = superform;

	//

	let preset: TemplatePreset | undefined = undefined;
	$: handlePresetSelection(preset);

	function handlePresetSelection(selectedPreset: TemplatePreset | undefined) {
		if (!selectedPreset) return;
		applyPreset(selectedPreset);
		preset = undefined;
	}

	function applyPreset(preset: TemplatePreset) {
		$form['zencode_script'] = preset.zencode_script;
		$form['zencode_data'] = preset.zencode_data;
		$form['schema'] = preset.schema;
		$form['schema_secondary'] = preset.schema_secondary;
	}

	//

	$: type = $form['type'];
</script>

<Form {superform} className="space-y-12">
	<div class="space-y-8">
		<SectionTitle
			tag="h5"
			title={m.Basic_info()}
			description={m.template_form_basic_info_description()}
		/>

		{#if !initialData['type']}
			<SelectInput
				{superform}
				field="type"
				options={{ options: Object.values(TemplatesTypeOptions) }}
			/>
		{/if}

		<Input {superform} field="name" options={{ placeholder: m.template_form_name_placeholder() }} />

		<Textarea
			{superform}
			field="description"
			options={{ placeholder: m.template_form_description_placeholder() }}
		/>
	</div>

	<div class="space-y-4">
		<SectionTitle tag="h5" title="Load preset" description="load_preset_description" />
		<Select items={templatePresetOptions} bind:value={preset} placeholder="Select option" />
	</div>

	<div class="space-y-8">
		<SectionTitle
			tag="h5"
			title={m.Attributes_needed()}
			description={type == TemplatesTypeOptions.issuance
				? m.attributes_needed_description_credential()
				: type == TemplatesTypeOptions.authorization
					? m.attributes_needed_description_authorization()
					: type == TemplatesTypeOptions.verification
						? m.attributes_needed_description_verification()
						: ''}
		/>

		<JSONSchemaInput {superform} field="schema" />
	</div>

	{#if $form.type == TemplatesTypeOptions.authorization}
		<div class="space-y-8">
			<SectionTitle
				tag="h5"
				title={m.Form_structure()}
				description={m.form_structure_description()}
			/>

			<JSONSchemaInput {superform} field="schema_secondary" />
		</div>
	{/if}

	<div class="space-y-8">
		<SectionTitle tag="h5" title={m.Custom_code()} description={m.custom_code_description()} />

		<div class="flex gap-8">
			<div class="grow">
				<Textarea
					field="zencode_script"
					options={{
						placeholder: 'Given I send ...',
						label: 'Zencode',
						class: 'font-mono'
					}}
					{superform}
				/>
			</div>

			<div class="grow">
				<Textarea
					field="zencode_data"
					options={{
						placeholder: '{\n  ...\n}',
						label: 'JSON',
						class: 'font-mono'
					}}
					{superform}
				/>
			</div>
		</div>
	</div>

	<div class="space-y-8">
		<SectionTitle tag="h5" title={m.Advanced_settings()} />

		<Checkbox field="public" {superform}>
			{m.Is_public()}: {m.template_is_public_description()}
		</Checkbox>
	</div>

	<Hr />

	<FormError />

	<div class="flex justify-end">
		<SubmitButton>{templateId ? m.Update_template() : m.Create_template()}</SubmitButton>
	</div>
</Form>
