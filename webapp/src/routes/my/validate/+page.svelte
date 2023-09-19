<script lang="ts">
	import TitleDescription from '$lib/components/titleDescription.svelte';
	import { Dropzone, Fileupload, Helper, P } from 'flowbite-svelte';
	import RenderSignedFile from '../signatures/_partials/RenderSignedFile.svelte';
	import { SignaturesTypeOptions } from '$lib/pocketbase/types';
	import type { SignedFile } from '../signatures/_partials/Files.svelte';

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
				hasErrors = true;
			}
		};
		reader.readAsText(fileUp[0]);
	}
</script>

<div class="p-8 flex flex-col gap-8 max-w-4xl">
	<TitleDescription title="Validate" description="Upload a signature file and verify autenticity" />
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
			class="mb-3 w-10 h-10 text-gray-400"
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
			<span class="font-semibold">Click to upload</span> or drag and drop
		</p>
		<p class="text-xs text-gray-500 dark:text-gray-400">JSON signature downloaded from signroom</p>
	</Dropzone>
	{#if file}
		<div class="flex gap-8">
			<P>{name}</P>
			<Helper helperClass="text-green-500">FILE VALID</Helper>
		</div>
		<RenderSignedFile signedFile={file.signedFile} type={file.type} leftButton />
	{/if}
	{#if hasErrors}
		<div class="space-y-1">
			<Helper helperClass="text-red-500">FILE REJECTED</Helper>
		</div>
	{/if}
</div>
