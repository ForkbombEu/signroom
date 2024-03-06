<script lang="ts">
	import { request } from '@api/downloadCredentialIssuer';
	import { downloadBlob } from '$lib/utils/downloadBlob';
	import CopyImageButton from '$lib/components/copyImageButton.svelte';

	import ServiceForm from '../_partials/serviceForm.svelte';
	import { Button, Heading, Hr, Spinner } from 'flowbite-svelte';
	import { ArrowDownTray } from 'svelte-heros-v2';
	import { generateQr } from '$lib/qrcode';
	import { m } from '$lib/i18n';


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
			<span class="ml-2"> {m.Download_credential_issuer()} </span>
		</Button>
	</div>

	<Hr />

	<Heading tag="h4">{m.Edit_service()}</Heading>
	<ServiceForm organizationId={data.organization.id} initialData={data.service} mode="edit" />

	<Hr />

	{#await qr()}
		<Hr />
	{:then qr}
		{@const qrimg = qr.result.qrcode}
		<div class="flex justify-between">
			<Heading tag="h4">{m.Service_Qr_Code()}</Heading>
			<CopyImageButton imageSrc={qrimg} />
		</div>
			<img src={qrimg} alt={m.Service_Qr_Code()} />
	{:catch error}
		<p class="text-red-500">{JSON.stringify(error)}</p>
	{/await}

	<Hr />

	<Heading tag="h4">{m.Service_preview()}</Heading>
	<div class="max-h-96 overflow-scroll border rounded-lg p-4">
		<pre>{JSON.stringify(data.service, null, 2)}</pre>
	</div>
</div>
