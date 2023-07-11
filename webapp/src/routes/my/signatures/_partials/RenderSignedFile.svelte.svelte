<script lang="ts">
	import { Accordion, AccordionItem, Button, Heading } from 'flowbite-svelte';
	import RenderJades from './RenderJades.svelte';
	import RenderXades from './RenderXades.svelte';
	import RenderPades from './RenderPades.svelte';
	import type { SignedFile } from './SignedFileDisplay.svelte';
	import { SignaturesTypeOptions } from '$lib/pocketbase-types';

	export let type: SignaturesTypeOptions = SignaturesTypeOptions.xades;
	export let signedFile: SignedFile;
	const { bytes: file } = signedFile;

	let result: any;

	const validate = async () => {
		const validate = await fetch('/api/validateSignature', {
			method: 'POST',
			body: JSON.stringify({ signedDocument: signedFile }),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const validateResult = await validate.json();
		result = validateResult;
	};

	const Types = SignaturesTypeOptions;
</script>

<div class="flex flex-col gap-8 justify-end">
	<div class="flex justify-end">
		<Button color="primary" on:click={validate}>Validate signature</Button>
	</div>
	<Accordion>
		<AccordionItem>
			<span slot="header">Signed file</span>
			{#if type === Types.xades}
				<RenderXades {file} />
			{/if}
			{#if type === Types.jades}
				<RenderJades {file} />
			{/if}
			{#if type === Types.pades}
				<RenderPades {file} />
			{/if}
		</AccordionItem>
		{#if result}
		<AccordionItem>
				<span slot="header">Validation data</span>
				<div class="overflow-x-scroll w-full h-max">
					<pre>{JSON.stringify(result, null, 2)}</pre>
				</div>
			</AccordionItem>
		{/if}
	</Accordion>
</div>
