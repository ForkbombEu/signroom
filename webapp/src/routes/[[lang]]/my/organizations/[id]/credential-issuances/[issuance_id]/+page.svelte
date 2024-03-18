<script lang="ts">
	import { request } from '@api/downloadCredentialIssuer';
	import { downloadBlob, imageSrcToBlob } from '$lib/utils/clientFileDownload';
	import CopyImageButton from '$lib/components/copyImageButton.svelte';

	import ServiceForm from '../_partials/serviceForm.svelte';
	import { Button, Heading, Hr, P, Spinner } from 'flowbite-svelte';
	import { ArrowDownTray } from 'svelte-heros-v2';
	import { generateQr } from '$lib/qrcode';
	import { m } from '$lib/i18n';
	import type { ObjectSchema } from '$lib/jsonSchema/types';

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
			// TODO - Improve type safety for all these values
			// - [expand] is by pb default [optional], but we are 100% sure it exists
			// - [t.schema] is by pb default [unknown], but we should be 100% sure that is a json object schema
			// I think this should be addressed in the load function
			templates: service.expand?.templates.map((t) => t.schema as ObjectSchema) ?? [],
			authorization_server: service.expand?.authorization_server.endpoint!,
			credential_issuer_url: service.expand?.issuer.endpoint!
		});

		if (response.ok) {
			const blob = new Blob([await response.arrayBuffer()], { type: 'application/zip' });
			downloadBlob(blob, 'credential-issuer.zip');
		}

		loading = false;
	}

	//

	async function generateCredentialIssuanceQr() {
		const { result } = await generateQr(
			JSON.stringify({
				credential_configuration_ids: [service.name],
				credential_issuer: `${service.expand?.issuer.endpoint}/credential_issuer`
			})
		);
		return result.qrcode as string;
	}

	async function downloadCredentialIssuanceQr(src: string) {
		const imgBlob = await imageSrcToBlob(src);
		downloadBlob(imgBlob, `credential-issuance-qr.png`);
	}
</script>

<div class="space-y-8">
	<div>
		<P>{m.Credential_issuance()}</P>
		<Heading tag="h2">{service.name}</Heading>
	</div>

	<Hr />

	<div class="flex justify-between items-center">
		<Heading tag="h4">Credential issuance server</Heading>

		<Button color="alternative" on:click={downloadCredentialIssuer} class="shrink-0">
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

	<Heading tag="h4">{m.Credential_issuance_QR()}</Heading>

	<div>
		{#await generateCredentialIssuanceQr()}
			<Spinner />
		{:then qrimg}
			<div class="flex gap-4 items-start">
				<img src={qrimg} alt={m.Service_Qr_Code()} class="border rounded-lg" />
				<div class="flex flex-col gap-2">
					<CopyImageButton imageSrc={qrimg}>Copy QR code</CopyImageButton>
					<Button
						color="alternative"
						size="sm"
						on:click={() => {
							downloadCredentialIssuanceQr(qrimg);
						}}
					>
						<ArrowDownTray />
						<span class="ml-2">Download QR code</span>
					</Button>
				</div>
			</div>
		{:catch error}
			<p class="text-red-500">{JSON.stringify(error)}</p>
		{/await}
	</div>

	<Hr />

	<Heading tag="h4">{m.Edit_service()}</Heading>
	<ServiceForm organizationId={data.organization.id} initialData={data.service} />
</div>
