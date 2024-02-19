<script lang="ts">
	import { request } from '@api/downloadCredentialIssuer';
	import { downloadBlob } from '$lib/utils/downloadBlob';

	import ServiceForm from '../_partials/serviceForm.svelte';
	import { Button, Heading, Hr, Spinner } from 'flowbite-svelte';
	import { ArrowDownTray } from 'svelte-heros-v2';
	import { generateQr } from '$lib/qrcode';

	//

	export let data;
	let { service, organization } = data;

	//

	let loading = false;

	async function downloadCredentialIssuer() {
		loading = true;

		const response = await request({
			credential_name: service.name,
			credential_issuer_name: organization.name,
			templates: service.expand?.templates.map((t) => t.schema) ?? [],
			authorization_server: service.expand?.authorization_server.endpoint!,
			credential_issuer_url: service.expand?.issuer.endpoint!
		});

		if (response.ok) {
			const blob = new Blob([await response.arrayBuffer()], { type: 'application/zip' });
			downloadBlob(blob, 'credential-issuer.zip');
		}

		loading = false;
	}
	const qr = async () => await generateQr(service);
</script>

<div class="space-y-8">
	<div class="flex justify-end">
		<Button color="alternative" on:click={downloadCredentialIssuer}>
			{#if loading}
				<div class="mr-2">
					<Spinner size="6"></Spinner>
				</div>
			{:else}
				<ArrowDownTray />
			{/if}
			<span class="ml-2"> Download credential issuer </span>
		</Button>
	</div>

	<Hr />

	<Heading tag="h4">Edit service</Heading>
	<ServiceForm organizationId={data.organization.id} initialData={data.service} mode="edit" />

	<Hr />

	{#await qr()}
		<Hr />
	{:then qr}
		<Heading tag="h4">Service Qr Code</Heading>
		<div class="flex justify-around">
			<img src={qr.result.qrcode} alt="Service QR Code" />
		</div>
	{:catch error}
		<p class="text-red-500">{JSON.stringify(error)}</p>
	{/await}

	<Hr />

	<Heading tag="h4">Service preview</Heading>
	<div class="max-h-96 overflow-scroll border rounded-lg p-4">
		<pre>{JSON.stringify(data.service, null, 2)}</pre>
	</div>
</div>
