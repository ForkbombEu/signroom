<script lang="ts">
	import { Button, Heading, Hr } from 'flowbite-svelte';
	import { ArrowDownTray } from 'svelte-heros-v2';
	import ServiceForm from '../_partials/serviceForm.svelte';
	import { downloadBlob } from '$lib/utils/downloadBlob';
	import { request } from '@api/downloadCredentialIssuer';

	export let data;

	async function downloadCredentialIssuer() {
		const response = await request({ template: data.service.expand?.templates[0]! });

		if (response.ok) {
			const blob = new Blob([await response.arrayBuffer()], { type: 'application/zip' });
			downloadBlob(blob, 'credential-issuer.zip');
		}
	}
</script>

<div class="space-y-8">
	<div class="flex justify-end">
		<Button color="alternative" on:click={downloadCredentialIssuer}>
			<ArrowDownTray />
			<span class="ml-2"> Download credential issuer </span>
		</Button>
	</div>
	<Hr />
	<Heading tag="h4">Service preview</Heading>
	<div class="max-h-96 overflow-scroll border rounded-lg p-4">
		<pre>{JSON.stringify(data.service, null, 2)}</pre>
	</div>
	<Hr />
	<Heading tag="h4">Edit service</Heading>
	<ServiceForm organizationId={data.organization.id} initialData={data.service} mode="edit" />
</div>
