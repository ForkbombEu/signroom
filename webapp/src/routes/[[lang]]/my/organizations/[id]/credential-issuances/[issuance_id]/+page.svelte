<script lang="ts">
	import { request } from '@api/downloadCredentialIssuer';
	import { downloadBlob } from '$lib/utils/clientFileDownload';
	import { Button, Spinner } from 'flowbite-svelte';
	import { ArrowDownTray, Pencil } from 'svelte-heros-v2';
	import { generateQr } from '$lib/qrcode';
	import { m } from '$lib/i18n';
	import type { ObjectSchema } from '$lib/jsonSchema/types';
	import PageTop from '$lib/components/pageTop.svelte';
	import PageContent from '$lib/components/pageContent.svelte';
	import PageCard from '$lib/components/pageCard.svelte';
	import OrganizationBreadcrumbs from '$lib/components/organizationBreadcrumbs.svelte';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import Icon from '$lib/components/icon.svelte';
	import { page } from '$app/stores';
	import { Avatar } from 'flowbite-svelte';
	import {
		flattenCredentialSubjectProperties,
		objectSchemaToCredentialSubject,
		DEFAULT_LOCALE
	} from '@api/downloadCredentialIssuer/utils.js';
	import { pipe, ReadonlyArray as A, flow } from 'effect';
	import type { TemplatesResponse } from '$lib/pocketbase/types.js';

	//

	export let data;
	let { service, organization } = data;
	let { credential_issuer, credential_template, authorization_server, authorization_template } =
		service.expand!;

	//

	let loading = false;

	async function downloadCredentialIssuer() {
		loading = true;

		const response = await request({
			credential_display_name: service.display_name,
			credential_type_name: service.type_name,
			credential_description: service.description,
			organization_name: organization.name,
			credential_template: credential_template.schema as ObjectSchema,
			authorization_data_template: authorization_template.schema as ObjectSchema,
			authorization_form_template: authorization_template.schema_secondary as ObjectSchema,
			credential_issuer_url: credential_issuer.endpoint,
			authorization_server_url: authorization_server.endpoint,
			credential_logo: service.logo
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
				credential_configuration_ids: [service.type_name],
				credential_issuer: credential_issuer.endpoint
			})
		);
		return result.qrcode as string;
	}

	//

	// async function downloadCredentialIssuanceQr(src: string) {
	// 	const imgBlob = await imageSrcToBlob(src);
	// 	downloadBlob(imgBlob, `credential-issuance-qr.png`);
	// }

	let templates = [
		{
			label: m.Credential_template(),
			name: credential_template.name,
			properties: getTemplatePropertyList(credential_template)
		},
		{
			label: m.Authorization_template(),
			name: authorization_template.name,
			properties: getTemplatePropertyList(authorization_template)
		}
	];

	function getTemplatePropertyList(template: TemplatesResponse) {
		return pipe(
			template.schema as ObjectSchema,
			objectSchemaToCredentialSubject,
			flattenCredentialSubjectProperties
		);
	}
</script>

<PageTop>
	<OrganizationBreadcrumbs></OrganizationBreadcrumbs>

	<SectionTitle title={service.display_name} description={service.description} />
</PageTop>

<PageContent>
	<div class="flex gap-8 items-start">
		<PageCard class="grow">
			<SectionTitle tag="h5" title={m.Credential_details()}>
				<div slot="right" class="flex items-center gap-2">
					<Button outline on:click={downloadCredentialIssuer} class="shrink-0">
						{m.Download_issuer()}
						{#if loading}
							<div class="ml-2">
								<Spinner size="5"></Spinner>
							</div>
						{:else}
							<Icon src={ArrowDownTray} ml></Icon>
						{/if}
					</Button>

					<Button href={`${$page.url.pathname}/edit`}>
						{m.Make_changes()}
						<Icon src={Pencil} ml></Icon>
					</Button>
				</div>
			</SectionTitle>

			<div class="font-medium space-y-8">
				<div class="flex gap-3 items-center pb-1">
					<p>Logo:</p>
					<Avatar class="object-cover border" size="lg" src={service.logo}></Avatar>
				</div>

				<p>
					{m.Credential_issuer()}:
					<span class="text-primary-700">{credential_issuer.endpoint}</span>
				</p>

				<p>
					{m.Authorization_server()}:
					<span class="text-primary-700">{authorization_server.endpoint}</span>
				</p>

				{#each templates as template}
					<div class="space-y-2">
						<p>
							{template.label}:
							<span class="text-primary-700">{template.name}</span>
						</p>
						<div class="divide-y bg-gray-50 border rounded-lg">
							{#each template.properties as [propertyId, property]}
								{@const displayName = property.display?.at(0)?.name}
								<div class="p-4">
									<p>
										{m.Property_ID()}: <span class="font-mono text-primary-700">{propertyId}</span>
									</p>
									{#if displayName}
										<p>
											{m.Display_name()}:
											<span class="text-primary-700">{displayName} ({DEFAULT_LOCALE})</span>
										</p>
									{/if}
									{#if property.mandatory}
										<p class="text-primary-700">{m.Required()}</p>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</PageCard>

		<PageCard class="!p-4 shrink-0">
			{#await generateCredentialIssuanceQr()}
				<Spinner />
			{:then qrimg}
				<div class="flex flex-col">
					<div
						class="self-stretch border rounded-lg flex flex-col items-center p-4 bg-gray-50 gap-2"
					>
						<p class="font-semibold text-xl">{service.display_name}</p>
						<img src={qrimg} alt={m.Service_Qr_Code()} class="rounded-md" />
					</div>

					<div class="mt-6 space-y-1">
						<p class="font-semibold">{m.This_is_an_issuance_flow()}</p>
						<p class="max-w-[200px] text-sm text-gray-500">{m.issuance_flow_description()}</p>
					</div>

					<Button outline class="mt-4" size="sm" disabled>
						{m.Download_QR_code_page()}
						<Icon src={ArrowDownTray} ml></Icon>
					</Button>
				</div>
			{:catch error}
				<p class="text-red-500">{JSON.stringify(error)}</p>
			{/await}
		</PageCard>
	</div>
</PageContent>
