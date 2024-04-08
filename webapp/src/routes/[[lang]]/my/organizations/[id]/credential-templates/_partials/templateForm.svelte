<script lang="ts">
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import { Checkbox, Form, createForm } from '$lib/forms';
	import Input from '$lib/forms/fields/input.svelte';
	import Textarea from '$lib/forms/fields/textarea.svelte';
	import { m } from '$lib/i18n';
	import { pb } from '$lib/pocketbase';
	import { getCollectionSchema } from '$lib/pocketbase/schema';
	import { Collections, TemplatesTypeOptions, type TemplatesResponse } from '$lib/pocketbase/types';
	import { fieldsSchemaToZod } from '$lib/pocketbaseToZod';
	import { Hr, Label, Select, type SelectOptionType } from 'flowbite-svelte';
	import JSONSchemaInput from './JSONSchemaInput.svelte';
	import type { SelectEvents } from 'flowbite-svelte/Select.svelte';
	import SubmitButton from '$lib/forms/submitButton.svelte';
	import { Create_template } from '$paraglide/messages';

	export let templateId: string | undefined = undefined;
	export let initialData: Partial<TemplatesResponse> = {};

	let schema = fieldsSchemaToZod(getCollectionSchema(Collections.Templates)!.schema);

	let superform = createForm(
		schema,
		async (e) => {
			let record;
			if (templateId) {
				record = await pb.collection(Collections.Services).update(templateId, e.form.data);
			} else {
				record = await pb.collection(Collections.Services).create(e.form.data);
			}
		},
		initialData,
		{
			dataType: 'json'
		}
	);

	const { form } = superform;

	//

	type CodeSample = {
		name: string;
		zencode_script: string;
		zencode_data: string;
	};

	const codeSamples: CodeSample[] = [
		{
			name: 'Generic HTTP request',
			zencode_script: `Given nothing\nThen print the string 'yes'`,
			zencode_data: `{\n  "myKey": "myValue"\n}`
		}
	];

	const codeSamplesOptions: SelectOptionType<CodeSample>[] = codeSamples.map((sample) => ({
		name: sample.name,
		value: sample
	}));

	let selectedCodeSample: CodeSample | undefined = undefined;
	$: handleCodeSampleSelection(selectedCodeSample);

	function handleCodeSampleSelection(selectedCodeSample: CodeSample | undefined) {
		if (!selectedCodeSample) return;
		setCodeSamples(selectedCodeSample);
		selectedCodeSample = undefined;
	}

	function setCodeSamples(sample: CodeSample) {
		$form['zencode_script'] = sample.zencode_script;
		$form['zencode_data'] = sample.zencode_data;
	}
</script>

<Form {superform} className="space-y-12">
	<div class="space-y-8">
		<SectionTitle
			tag="h5"
			title={m.Basic_info()}
			description={m.template_form_basic_info_description()}
		/>

		<Input {superform} field="name" options={{ placeholder: m.template_form_name_placeholder() }} />

		<Textarea
			{superform}
			field="description"
			options={{ placeholder: m.template_form_description_placeholder() }}
		/>
	</div>

	<div class="space-y-8">
		<SectionTitle
			tag="h5"
			title={m.Attributes_needed()}
			description={m.attributes_needed_description()}
		/>

		<JSONSchemaInput {superform} field="schema"></JSONSchemaInput>
	</div>

	<div class="space-y-8">
		{#if $form.type == TemplatesTypeOptions.authorization}
			<SectionTitle
				tag="h5"
				title={m.Form_structure()}
				description={m.form_structure_description()}
			/>

			<JSONSchemaInput {superform} field="schema"></JSONSchemaInput>
		{/if}
	</div>

	<div class="space-y-8">
		<SectionTitle tag="h5" title={m.Custom_code()} description={m.custom_code_description()} />

		<div class="space-y-2">
			<Label>{m.select_code_sample()}</Label>
			<Select items={codeSamplesOptions} bind:value={selectedCodeSample}></Select>
		</div>

		<div class="flex gap-8">
			<Textarea
				field="zencode_script"
				options={{
					placeholder: 'Given I send ...',
					label: 'Zencode',
					class: 'font-mono'
				}}
				{superform}
			/>

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

		<Checkbox {superform} field="allow_extra_attributes">{m.Allow_extra_attributes()}</Checkbox>
	</div>

	<Hr />

	<div class="flex justify-end">
		<SubmitButton>{templateId ? m.Update_template() : m.Create_template()}</SubmitButton>
	</div>
</Form>
