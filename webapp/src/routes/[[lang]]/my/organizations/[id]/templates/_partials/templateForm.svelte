<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import { Checkbox, Form, createForm, Select as SelectInput, FieldController } from '$lib/forms';
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
	import { A, Alert, Hr, Select } from 'flowbite-svelte';
	import JSONSchemaInput from './JSONSchemaInput.svelte';
	import SubmitButton from '$lib/forms/submitButton.svelte';
	import FormError from '$lib/forms/formError.svelte';
	import { createEventDispatcher } from 'svelte';
	import { templatePresetOptions, type TemplatePreset } from './templatePresets';
	import CodeEditorField from './codeEditorField.svelte';
	import Icon from '$lib/components/icon.svelte';
	import { ArrowTopRightOnSquare } from 'svelte-heros-v2';

	//

	export let templateId: string | undefined = undefined;
	export let initialData: Partial<TemplatesRecord> = {
		type: TemplatesTypeOptions.issuance
	};

	//

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

	/* Preset application */

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
		$form['schema'] = JSON.stringify(preset.schema);
		$form['schema_secondary'] = JSON.stringify(preset.schema_secondary);
	}

	//

	$: type = getType($form);

	function getType(form: typeof $form | undefined | null) {
		if (form) return $form['type'];
		else return undefined;
	}

	// setup code placeholders

	addCodePlaceholders();

	function addCodePlaceholders() {
		if (!$form['zencode_script']) $form['zencode_script'] = '# Add code here';
		if (!$form['zencode_data']) $form['zencode_data'] = `{}`;
	}
</script>

<Form {superform} className="space-y-12" showRequiredIndicator>
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
			title="{m.Attributes_needed()} *"
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

	{#if type == TemplatesTypeOptions.authorization}
		<div class="space-y-8">
			<SectionTitle
				tag="h5"
				title="{m.Form_structure()} *"
				description={m.form_structure_description()}
			/>

			<JSONSchemaInput {superform} field="schema_secondary" />
		</div>
	{/if}

	<div class="space-y-8">
		<SectionTitle tag="h5" title="{m.Custom_code()}*" description={m.custom_code_description()} />
		<Alert>
			<div class="flex justify-between">
				<p>Test your code with the slangroom editor!</p>
				<a
					href="https://dyne.org/slangroom/playground/"
					class=" underline hover:no-underline"
					target="_blank"
				>
					Slangroom Playground [↗]
				</a>
			</div>
		</Alert>
		<CodeEditorField {superform} field="zencode_script" label={m.zencode_script()} lang="gherkin" />
		<CodeEditorField {superform} field="zencode_data" label={m.zencode_data()} lang="json" />
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
