<script lang="ts">
	import { Dropzone, Alert, Spinner, Button } from 'flowbite-svelte';
	import { m } from '$lib/i18n';
	import PageTop from '$lib/components/pageTop.svelte';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import PageContent from '$lib/components/pageContent.svelte';
	import PageCard from '$lib/components/pageCard.svelte';
	import Icon from '$lib/components/icon.svelte';
	import { CloudArrowUp, XMark } from 'svelte-heros-v2';
	import { readFileAsBase64 } from '$lib/utils/files';
	import {
		validateSignedFile,
		isSignatureValid,
		type ValidateSignatureResponse
	} from '$lib/signatures';
	import { getErrorMessage } from '$lib/errorHandling';

	//

	async function validateSignatureFile(file: File) {
		const base64file = await readFileAsBase64(file);
		return await validateSignedFile({
			bytes: base64file,
			digestAlgorithm: null,
			name: file.name
		});
	}

	//

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		const file = e.dataTransfer?.files.item(0);
		if (file) handleFileValidation(file);
	}

	function handleChange(e: Event) {
		e.preventDefault();
		const file = (e.target as HTMLInputElement)?.files?.item(0);
		if (file) handleFileValidation(file);
	}

	//

	let signatureFile: File | undefined = undefined;
	let result: ValidateSignatureResponse | undefined = undefined;
	let error: string | undefined = undefined;
	let loading = false;

	async function handleFileValidation(file: File) {
		resetSubmitState();
		loading = true;
		signatureFile = file;
		try {
			result = await validateSignatureFile(file);
			console.log(result);
		} catch (e) {
			error = getErrorMessage(e);
		}
		loading = false;
	}

	function resetSubmitState() {
		result = undefined;
		error = undefined;
		loading = false;
	}

	//

	function handleRemoveFile() {
		resetSubmitState();
		signatureFile = undefined;
		removeFileFromDropzone();
	}

	const DROPZONE_ID = 'dropzone';

	function removeFileFromDropzone() {
		const dropzone = document.getElementById(DROPZONE_ID) as HTMLInputElement;
		dropzone.value = '';
	}
</script>

<PageTop>
	<SectionTitle title={m.Validate()} description={m.validate_signature_description()} />
</PageTop>

<PageContent>
	<PageCard class="!space-y-4">
		<SectionTitle tag="h5" title="Select file" hideLine />
		<Dropzone
			id={DROPZONE_ID}
			class="max-h-[200px] hover:cursor-default"
			on:dragover={(e) => e.preventDefault()}
			on:drop={handleDrop}
			on:change={handleChange}
		>
			<div
				class="hover:border-primary-600 flex cursor-pointer flex-col items-center rounded-lg border border-gray-300 bg-white p-4 shadow-md hover:border-2"
			>
				<Icon src={CloudArrowUp} size={50} class="text-gray-500" />
				<p class="text-gray-500">
					{m.Click_to_upload_or_drag_and_drop()}
				</p>
			</div>
		</Dropzone>

		{#if signatureFile}
			<Alert color="gray" dismissable class="justify-between">
				<p class="font-bold">{signatureFile.name}</p>
				<p>{Math.round(signatureFile.size / 1000)} KB</p>
				<svelte:fragment slot="close-button" let:close>
					<Button
						size="xs"
						color="alternative"
						on:click={(e) => {
							close(e);
							handleRemoveFile();
						}}
					>
						<Icon src={XMark} mr />
						{m.Remove()}
					</Button>
				</svelte:fragment>
			</Alert>
		{/if}

		{#if error}
			<Alert color="red" title="dismissable">
				<p class="font-bold">{m.Error()}</p>
				<p>{error}</p>
			</Alert>
		{/if}
	</PageCard>

	{#if loading}
		<PageCard class="flex flex-col items-center !space-y-2">
			<Spinner />
			<p>{m.Checking_file()}</p>
		</PageCard>
	{/if}

	{#if result}
		<PageCard class="!space-y-4">
			<SectionTitle tag="h5" title={m.Validation_result()} />
			{#if 'message' in result}
				<Alert color="red">
					<p class="font-bold">{m.Error()}</p>
					<p>{result.message}</p>
				</Alert>
			{:else}
				{@const details = result.SimpleReport.signatureOrTimestampOrEvidenceRecord}

				{#if isSignatureValid(result)}
					<Alert color="green">
						<p class="font-bold">{m.Success()}</p>
						<p>{m.Your_signature_file_is_valid()}</p>
					</Alert>
				{:else}
					<Alert color="yellow">
						<p class="font-bold">{m.Warning()}</p>
						<p>{m.There_are_issues_in_the_submitted_file()}</p>
						{#if details}
							<p>{m.Please_see_the_report_below()}</p>
						{/if}
					</Alert>

					{#if details}
						{#each details as detail}
							<Alert color="gray">
								{@const errorTitle = detail.Signature.SubIndication}
								{@const errors = detail.Signature.AdESValidationDetails.Error}
								<p class="font-bold">{errorTitle}</p>
								<ul>
									{#each errors as error}
										<li>{error.value}</li>
									{/each}
								</ul>
							</Alert>
						{/each}
					{/if}
				{/if}
			{/if}
		</PageCard>
	{/if}
</PageContent>
