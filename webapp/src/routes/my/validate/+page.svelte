<script lang="ts">
	import TitleDescription from '$lib/components/titleDescription.svelte';
	import { Fileupload, Helper, P } from 'flowbite-svelte';
	import RenderSignedFile from '../signatures/_partials/RenderSignedFile.svelte';
	import type { SignedFile } from '../signatures/_partials/SignedFileDisplay.svelte';
	import { SignaturesTypeOptions } from '$lib/pocketbase-types';

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

	async function handleFileSelect(e: Event) {
		const fileUp = (e.target as HTMLInputElement)?.files;
		if (!fileUp) return;
		var reader = new FileReader();
		reader.onload = function (e) {
			try {
				const json = JSON.parse(e.target?.result as string);
				if (!isSignatureFile(json)) throw new Error('Not a signature file');
				file = json;
				name = fileUp[0].name;
			} catch (error) {
				hasErrors = true;
			}
		};
		reader.readAsText(fileUp[0]);
	}
</script>

<div class="p-8 flex flex-col gap-8">
	<TitleDescription title="Validate" description="Upload a signature file and verify autenticity" />
	<Fileupload multiple={false} accept=".json" on:change={handleFileSelect} />
	{#if file}
		<P>{name}</P>
		<RenderSignedFile signedFile={file.signedFile} type={file.type} />
	{/if}
	{#if hasErrors}
		<div class="space-y-1">
			<Helper helperClass="text-red-500">FILE REJECTED</Helper>
		</div>
	{/if}
</div>
