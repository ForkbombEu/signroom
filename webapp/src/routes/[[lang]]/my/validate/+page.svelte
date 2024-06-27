<script lang="ts">
	import TitleDescription from '$lib/components/titleDescription.svelte';
	import { Dropzone, Helper, P } from 'flowbite-svelte';
	import RenderSignedFile from '../signatures/_partials/RenderSignedFile.svelte';
	import { SignaturesTypeOptions } from '$lib/pocketbase/types';
	import type { SignedFile } from '../signatures/_partials/Files.svelte';
	import { m } from '$lib/i18n';

	type SignatureFile = {
		type: SignaturesTypeOptions;
		signedFile: SignedFile;
	};

	let file: SignatureFile;

	let name: string;
	let hasErrors = false;

	const isSignatureFile = (obj: any): obj is SignatureFile =>
		typeof obj === 'object' &&
		obj !== null &&
		'type' in obj &&
		'signedFile' in obj &&
		typeof obj.type === 'string' &&
		Object.values(SignaturesTypeOptions).includes(obj.type) &&
		typeof obj.signedFile === 'object' &&
		obj.signedFile !== null &&
		typeof obj.signedFile.name === 'string' &&
		typeof obj.signedFile.bytes === 'string';

	const dropHandle = async (e: any) => {
		e.preventDefault();
		const fileUp = (e.dataTransfer as HTMLInputElement).files;
		handleFileSelect(e, fileUp);
	};

	async function handleFileSelect(e: Event, fileUploaded?: FileList | null) {
		const fileUp = fileUploaded || (e.target as HTMLInputElement)?.files;
		if (!fileUp) return;
		var reader = new FileReader();
		reader.onload = function (e) {
			try {
				const json = JSON.parse(e.target?.result as string);
				if (!isSignatureFile(json)) throw new Error('Not a signature file');
				file = json;
				name = fileUp[0].name;
				hasErrors = false;
			} catch (error) {
				console.log(error);
				hasErrors = true;
			}
		};
		reader.readAsText(fileUp[0]);
	}
</script>

<div class="p-4">
	<TitleDescription
		title={m.Validate()}
		description={m.Upload_a_signature_file_and_verify_autenticity()}
	/>
	<br />
	<Dropzone
		id="dropzone"
		on:drop={dropHandle}
		on:dragover={(event) => {
			event.preventDefault();
		}}
		on:change={handleFileSelect}
		multiple={false}
		accept=".json"
	>
		<svg
			aria-hidden="true"
			class="mb-3 h-10 w-10 text-gray-400"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
			/></svg
		>
		<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
			<span class="font-semibold">{m.Click_to_upload()}</span>
			{m.or_drag_and_drop()}
		</p>
		<p class="text-xs text-gray-500 dark:text-gray-400">
			{m.JSON_signature_downloaded_from_signroom()}
		</p>
	</Dropzone>
	{#if file}
		<div class="flex gap-8">
			<P>{name}</P>
			<Helper helperClass="text-green-500">{m.FILE_VALID()}</Helper>
		</div>
		<RenderSignedFile signedFile={file.signedFile} type={file.type} leftButton />
	{/if}
	{#if hasErrors}
		<div class="space-y-1">
			<Helper helperClass="text-red-500">{m.FILE_REJECTED()}</Helper>
		</div>
	{/if}
</div>
