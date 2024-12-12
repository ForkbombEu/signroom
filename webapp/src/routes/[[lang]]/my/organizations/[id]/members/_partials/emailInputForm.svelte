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

	const schema = z
		.object({
			file_source: z.string().optional(),
			text_source: z.string().optional()
		})
		.refine((data) => Boolean(data.file_source) || Boolean(data.text_source));

	const superform = createForm(schema, ({ form }) => {
		onSuccess(getEmailsFromFormData(form.data));
	});
	const { form, tainted } = superform;

	$: emails = getEmailsFromFormData($form);

	//

	function getEmailsFromFormData(data: typeof $form) {
		return A.dedupe(extractEmailsFromText(data.file_source + ' ' + data.text_source));
	}

	function extractEmailsFromText(text: string): string[] {
		const emailRegex = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g;
		const emails = text.match(emailRegex);
		return emails || [];
	}

	function isFormTainted(t: typeof $tainted) {
		return Object.values(t ?? {}).some((s) => s);
	}

	/* File upload handling */

	let fileList: FileList | undefined = undefined;
	$: if (fileList) handleFileUpload(fileList);

	async function handleFileUpload(fileList: FileList) {
		const file = fileList.item(0);
		if (!file) return;
		$form['file_source'] = await readFileAsString(file);
	}

	const acceptedFiles: Record<string, string | string[]> = {
		'Plain text': 'text/plain',
		CSV: 'text/csv',
		Markdown: 'text/markdown',
		XML: ['application/xml', 'text/xml'],
		JSON: 'application/json'
	};

	const acceptedFilesNames = Object.keys(acceptedFiles).join(', ');
	const mimeTypes = Object.values(acceptedFiles).flat().join(', ');
</script>

<!--  -->

<div class="space-y-2">
	<Label for="file">{m.Upload_a_file_containing_emails()}</Label>
	<input
		name="file"
		type="file"
		class="w-full rounded-lg border"
		accept={mimeTypes}
		bind:files={fileList}
	/>
	<FieldHelpText text="{m.accepted_files()}: {acceptedFilesNames}" />
</div>

<Form {superform}>
	<div class="flex items-center gap-4">
		<hr class="grow basis-1" />
		<p>{m.and()} / {m.or()}</p>
		<hr class="grow basis-1" />
	</div>

	<div class="space-y-2">
		<Label for="file">{m.Paste_email_addresses_here()}</Label>
		<textarea
			bind:value={$form['text_source']}
			class="hover:border-primary-500 h-[150px] max-h-[150px] w-full resize-none rounded-lg border border-gray-200 focus:border-gray-200"
		/>
	</div>

	{#if isFormTainted($tainted) && emails.length == 0}
		<Alert color="yellow" border>
			<p class="font-bold">{m.Warning()}</p>
			<p>
				{m.We_havent_found_any_emails_in_the_provided_documents_please_upload_a_new_file_or_paste_new_content_()}
			</p>
		</Alert>
	{/if}

	{#if emails.length}
		<Alert color="green" border>
			<div class="flex items-center justify-between gap-2">
				<p>✅ {emails.length} {m.Emails_found()}</p>
				<SubmitButton>
					<Icon src={ArrowRight} mr></Icon>
					{m.Review_and_confirm()}
				</SubmitButton>
			</div>
		</Alert>
	{/if}
</Form>
