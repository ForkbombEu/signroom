<script lang="ts">
	import { Button, Hr } from 'flowbite-svelte';
	import { ArrowDownTray } from 'svelte-heros-v2';
	import ServiceForm from '../_partials/serviceForm.svelte';
	import { downloadBlob } from '$lib/utils/downloadBlob';

	export let data;

	async function downloadCredentialIssuer() {
		const response = await fetch('/api/downloadCredentialIssuer', {
			method: 'POST',
			body: JSON.stringify({ a: 'ciao' }),
			headers: {
				'content-type': 'application/json'
			}
		});

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
	<div class="max-h-96 overflow-scroll border rounded-lg p-4">
		<pre>{JSON.stringify(data, null, 2)}</pre>
	</div>
	<Hr />
	<ServiceForm organizationId={data.organization.id} initialData={data.service} mode="edit" />
</div>
