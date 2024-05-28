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
				record = await pb.collection(Collections.Templates).update(templateId, e.form.data);
			} else {
				record = await pb.collection(Collections.Templates).create(e.form.data);
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

		<JSONSchemaInput {superform} field="schema"></JSONSchemaInput>
	</div>

	{#if $form.type == TemplatesTypeOptions.authorization}
		<div class="space-y-8">
			<SectionTitle
				tag="h5"
				title={m.Form_structure()}
				description={m.form_structure_description()}
			/>

			<JSONSchemaInput {superform} field="schema_secondary"></JSONSchemaInput>
		</div>
	{/if}

	<div class="space-y-8">
		<SectionTitle tag="h5" title={m.Custom_code()} description={m.custom_code_description()} />

		<div class="space-y-2">
			<Label>{m.select_code_sample()}</Label>
			<Select items={codeSamplesOptions} bind:value={selectedCodeSample}></Select>
		</div>

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

		<Checkbox {superform} field="allow_extra_attributes">{m.Allow_extra_attributes()}</Checkbox>
	</div>

	<div class="space-y-8">
		<SectionTitle tag="h5" title={m.Advanced_settings()} />

		<Checkbox field="public" {superform}>
			{m.Is_public()}: {m.template_is_public_description()}
		</Checkbox>
	</div>

	<Hr />

	<FormError></FormError>

	<div class="flex justify-end">
		<SubmitButton>{templateId ? m.Update_template() : m.Create_template()}</SubmitButton>
	</div>
</Form>
