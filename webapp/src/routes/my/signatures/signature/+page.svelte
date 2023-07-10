<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { page } from '$app/stores';
	import { Button, Heading } from 'flowbite-svelte';
	import RenderXades from './RenderXades.svelte';
	import RenderJades from './RenderJades.svelte';
	import RenderPades from './RenderPades.svelte';

	let type: string;
	let file: string;
	let fileObj: { bytes: string; name: string; digestAlgorithm: string };
	let result: any;
	const url = $page.url;
	const recordId = url.searchParams.get('id');

	if (!recordId) throw new Error('No record id');
	pb.collection('signatures')
		.getOne(recordId)
		.then(async (record) => {
			if (!record) throw new Error('No record');
			if (!record?.signed_file) throw new Error('No signed file');
			fileObj = record?.signed_file;
			file = fileObj?.bytes;
			type = record?.type;
		});

	const validate = async () => {
		const validate = await fetch('/api/validateSignature', {
			method: 'POST',
			body: JSON.stringify({ signedDocument: fileObj }),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const validateResult = await validate.json();
		result = validateResult;
	};
</script>

<div class="flex flex-col gap-8 justify-end">
	<Heading as="h4">Signature</Heading>
	{#if type === 'xades'}<RenderXades {file} />
	{/if}
	{#if type === 'jades'}<RenderJades {file} />
	{/if}
	{#if type === 'pades'}
		<RenderPades {file} />
	{/if}
	<div class="flex flex-row gap-4">
		<Button color="primary" on:click={validate}>Validate signature</Button>
	</div>
	{#if result}
		<div class="overflow-x-scroll w-full h-max">
			<pre>{JSON.stringify(result, null, 2)}</pre>
		</div>
	{/if}
</div>
