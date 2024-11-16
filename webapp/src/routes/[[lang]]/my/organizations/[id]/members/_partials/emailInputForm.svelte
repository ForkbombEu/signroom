<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import Icon from '$lib/components/icon.svelte';
	import { createForm, Form } from '$lib/forms';
	import FieldHelpText from '$lib/forms/fields/fieldParts/fieldHelpText.svelte';
	import SubmitButton from '$lib/forms/submitButton.svelte';
	import { m } from '$lib/i18n';
	import { readFileAsString } from '$lib/utils/files';
	import { Array as A } from 'effect';
	import { Alert, Button, Label } from 'flowbite-svelte';
	import { ArrowRight } from 'svelte-heros-v2';
	import { z } from 'zod';

	//

	export let onSuccess: (emails: string[]) => void = () => {};

	/* Input form */

	const acceptedFiles: Record<string, string | string[]> = {
		'Plain text': 'text/plain',
		CSV: 'text/csv',
		Markdown: 'text/markdown',
		XML: ['application/xml', 'text/xml'],
		JSON: 'application/json'
	};

	const acceptedFilesNames = Object.keys(acceptedFiles).join(', ');
	const mimeTypes = Object.values(acceptedFiles).flat();
	const acceptAttribute = mimeTypes.join(', ');

	//

	const schema = z
		.object({
			file_source: zodFileSchema({ mimeTypes }).optional(),
			text_source: z.string().optional()
		})
		.refine((data) => Boolean(data.file_source) || Boolean(data.text_source));

	const form = createForm({
		adapter: zod(schema),
		onSubmit: async ({ form }) => {
			onSuccess(await getEmailsFromFormData(form.data));
		},
		options: { dataType: 'form' }
	});
	const { form: formData, tainted } = form;

	$: getEmailsFromFormData($formData);

	//

	let emails: string[] = [];
	$: getEmailsFromFormData($formData).then((res) => (emails = res));

	async function getEmailsFromFormData(data: typeof $formData) {
		let sources: string[] = [];
		if (data.text_source) sources.push(data.text_source);
		if (data.file_source) sources.push(await readFileAsString(data.file_source));
		return A.dedupe(extractEmailsFromText(sources.join(' ')));
	}

	function extractEmailsFromText(text: string): string[] {
		const emailRegex = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g;
		const emails = text.match(emailRegex);
		return emails || [];
	}

	function isFormTainted(t: typeof $tainted) {
		return Object.values(t ?? {}).some((s) => s);
	}
</script>

<!--  -->

<Form {form} hide={['submitButton']}>
	<FileField
		{form}
		name="file_source"
		options={{
			accept: acceptAttribute,
			label: m.Upload_a_file_containing_emails(),
			description: `${m.accepted_files()}: ${acceptedFilesNames}`
		}}
	/>

	<div class="flex items-center gap-4">
		<Separator class="w-0 grow" />
		<T>{m.and()} / {m.or()}</T>
		<Separator class="w-0 grow" />
	</div>

	<TextareaField {form} name="text_source" options={{ label: m.Paste_email_addresses_here() }} />

	{#if isFormTainted($tainted) && emails.length == 0}
		<Alert variant="warning" let:Title let:Description>
			<Title>{m.Warning()}</Title>
			<Description>
				{m.We_havent_found_any_emails_in_the_provided_documents_please_upload_a_new_file_or_paste_new_content_()}
			</Description>
		</Alert>
	{/if}

	{#if emails.length}
		<Alert variant="success" let:Title class="!p-4">
			<div class="flex items-center justify-between gap-2">
				<Title><span class="mr-1">✅</span> {emails.length} {m.Emails_found()}</Title>
				<SubmitButton variant="default">
					<Icon src={ArrowRight} mr></Icon>
					{m.Review_and_confirm()}
				</SubmitButton>
			</div>
		</Alert>
	{/if}
</Form>
