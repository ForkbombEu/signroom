<script lang="ts">
	import { Accordion, AccordionItem, Button, Heading } from 'flowbite-svelte';
	import RenderJades from './RenderJades.svelte';
	import RenderXades from './RenderXades.svelte';
	import RenderPades from './RenderPades.svelte';
	import { SignaturesTypeOptions } from '$lib/pocketbase/types';
	import type { SignedFile } from './Files.svelte';
	import { m } from '$lib/i18n';

	export let type: SignaturesTypeOptions = SignaturesTypeOptions.xades;
	export let signedFile: SignedFile;
	export let leftButton = false;
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

<div class="flex flex-col justify-end gap-8">
	<div class={`flex justify-${leftButton ? 'start' : 'end'}`}>
		<Button color="primary" on:click={validate}>{m.Validate_signature()}</Button>
	</div>
	<Accordion>
		<AccordionItem open={!result}>
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
			<AccordionItem open={!!result}>
				<span slot="header">Validation data</span>
				<div class="h-max w-full overflow-x-scroll">
					<pre>{JSON.stringify(result, null, 2)}</pre>
				</div>
			</AccordionItem>
		{/if}
	</Accordion>
</div>
