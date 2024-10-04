<script lang="ts">
	import Icon from '$lib/components/icon.svelte';
	import IconButton from '$lib/components/iconButton.svelte';
	import { createForm, Form } from '$lib/forms';
	import FieldHelpText from '$lib/forms/fields/fieldParts/fieldHelpText.svelte';
	import FormError from '$lib/forms/formError.svelte';
	import { m } from '$lib/i18n';
	import { pb } from '$lib/pocketbase';
	import { readFileAsString } from '$lib/utils/files';
	import { Array as A } from 'effect';
	import { Alert, Button, Input, Label } from 'flowbite-svelte';
	import { ArrowLeft, ArrowRight, Envelope, XMark } from 'svelte-heros-v2';
	import { z } from 'zod';

	//

	export let organizationId: string;
	export let onSuccess: (emails: string[]) => void = () => {};
	export let onCancel = () => {};

	let state: 'input' | 'review' = 'input';

	/* Form */

	const schema = z.object({
		file_source: z.string().optional(),
		text_source: z.string().optional()
	});

	const superform = createForm(schema, async () => {
		pb.send('/organizations/invite', {
			method: 'POST',
			body: {
				organizationId,
				emails
			}
		});
		onSuccess(emails);
	});
	const { form, tainted } = superform;

	let emails: string[] = [];
	$: handleFormChange($form);

	function handleFormChange(data: typeof $form) {
		emails = A.dedupe(extractEmailsFromText(data.file_source + ' ' + data.text_source));
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

	/* Email filtering */

	let filterText: string | undefined = undefined;

	function filterEmails(emails: string[], text: string | undefined) {
		if (!Boolean(text)) return emails;
		return emails.filter((e) => e.includes(text ?? ''));
	}

	function removeEmail(email: string) {
		emails = A.remove(emails, emails.indexOf(email));
	}
</script>

<Form {superform}>
	<div class="space-y-6">
		{#if state == 'input'}
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
						<Button color="primary" on:click={() => (state = 'review')}>
							<Icon src={ArrowRight} mr></Icon>
							{m.Review_and_confirm()}
						</Button>
					</div>
				</Alert>
			{/if}
		{:else}
			<p>{m.Review_the_email_list_before_sending()}</p>

			<div class="space-y-2">
				<Label>{m.Search_emails()} ({emails.length})</Label>
				<Input placeholder="mail@example.org" bind:value={filterText} />
			</div>

			<div class="h-[300px] divide-y overflow-scroll rounded-lg border">
				{#each filterEmails(emails, filterText) as email}
					<div class="flex items-center justify-between py-1 pl-4 pr-2">
						<p class="text-sm">{email}</p>
						<IconButton on:click={() => removeEmail(email)} />
					</div>
				{/each}
			</div>

			<FormError></FormError>

			<div class="flex items-center justify-between">
				<Button outline on:click={() => (state = 'input')}>
					<Icon src={ArrowLeft} size={16} mr />{m.Back()}
				</Button>
				<div class="flex items-center gap-2">
					<Button outline on:click={onCancel}>
						<Icon src={XMark} mr />
						{m.Cancel()}
					</Button>
					<Button type="submit">
						<Icon src={Envelope} mr />
						{m.Send_invites()}
					</Button>
				</div>
			</div>
		{/if}
	</div>
</Form>
