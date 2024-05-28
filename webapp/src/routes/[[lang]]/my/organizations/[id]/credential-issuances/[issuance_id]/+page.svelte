<script lang="ts">
	import { request } from '@api/downloadCredentialIssuer';
	import { downloadBlob } from '$lib/utils/clientFileDownload';
	import { Button, Heading, Spinner } from 'flowbite-svelte';
	import {
		ArrowDownTray,
		ArrowTopRightOnSquare,
		Pencil,
		QuestionMarkCircle
	} from 'svelte-heros-v2';
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
	import { ProtectedOrgUI } from '$lib/rbac';
	import TemplateSchemaDisplay from '$lib/components/templateSchemaDisplay.svelte';
	import { assets } from '$app/paths';

	//

	export let data;
	let { service, organization, authServerScopesSupported } = data;
	let { credential_issuer, credential_template, authorization_server, authorization_template } =
		service.expand!;

	//

	let loading = false;

	async function downloadCredentialIssuer() {
		loading = true;

		const response = await request({
			credential_display_name: service.display_name,
			credential_type_name: service.type_name,
			credential_issuer_name: credential_issuer.name,
			credential_description: service.description,
			credential_template: credential_template.schema as ObjectSchema,
			authorization_data_template: authorization_template.schema as ObjectSchema,
			authorization_form_template: authorization_template.schema_secondary as ObjectSchema,
			credential_issuer_url: credential_issuer.endpoint,
			authorization_server_url: authorization_server.endpoint,
			credential_logo: service.logo,
			scopes_supported: authServerScopesSupported
		});

		if (response.ok) {
			const blob = new Blob([await response.arrayBuffer()], { type: 'application/zip' });
			downloadBlob(blob, 'microservices.zip');
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

	let microservicesTemplates = [
		{
			label: m.Credential_template(),
			name: credential_template.name,
			template: credential_template
		},
		{
			label: m.Authorization_template(),
			name: authorization_template.name,
			template: authorization_template
		}
	];
</script>

<PageTop>
	<OrganizationBreadcrumbs></OrganizationBreadcrumbs>

	<SectionTitle title={service.display_name} description={service.description} />
</PageTop>

<PageContent>
	<div class="flex items-start gap-8">
		<PageCard class="grow">
			<SectionTitle tag="h5" title={m.Credential_details()}>
				<div slot="right" class="flex items-center gap-2">
					<Button outline on:click={downloadCredentialIssuer} class="shrink-0">
						{m.Download_microservices()}
						{#if loading}
							<div class="ml-2">
								<Spinner size="5"></Spinner>
							</div>
						{:else}
							<Icon src={ArrowDownTray} ml></Icon>
						{/if}
					</Button>

					<ProtectedOrgUI orgId={organization.id} roles={['admin', 'owner']}>
						<Button href={`${$page.url.pathname}/edit`}>
							{m.Make_changes()}
							<Icon src={Pencil} ml></Icon>
						</Button>
					</ProtectedOrgUI>
				</div>
			</SectionTitle>

			<div class="space-y-8 font-medium">
				<div class="flex items-center gap-3 pb-1">
					<p>Logo:</p>
					<Avatar class="border object-cover" size="lg" src={service.logo}></Avatar>
				</div>

				<p>
					{m.Credential_issuer()}:
					<span class="text-primary-700">{credential_issuer.endpoint}</span>
				</p>

				<p>
					{m.Authorization_server()}:
					<span class="text-primary-700">{authorization_server.endpoint}</span>
				</p>

				{#each microservicesTemplates as t}
					<div class="space-y-2">
						<p>
							{t.label}:
							<span class="text-primary-700">{t.name}</span>
						</p>
						<TemplateSchemaDisplay template={t.template}></TemplateSchemaDisplay>
					</div>
				{/each}
			</div>
		</PageCard>

		<PageCard class="w-[300px] shrink-0 !space-y-4 !p-4">
			{#await generateCredentialIssuanceQr()}
				<Spinner />
			{:then qrimg}
				<div class="flex flex-col items-center gap-2 self-stretch rounded-lg border bg-gray-50 p-4">
					<img src={qrimg} alt={m.Service_Qr_Code()} class="rounded-md" />
					<Button outline class="mt-4" size="sm" disabled>
						<span class="whitespace-nowrap">
							{m.Open_qr_code_in_new_page()}
						</span>
						<Icon src={ArrowTopRightOnSquare} ml></Icon>
					</Button>
				</div>

				<div class="mt-6 space-y-2">
					<Heading tag="h5">{m.issuance_flow_qr_code_title()}</Heading>
					<p class="text-gray-500">{m.issuance_flow_qr_code_description()}</p>
				</div>

				<div class="flex gap-4">
					<img
						alt="Didroom Wallet app logo"
						class="h-[100px] w-[100px] rounded-lg"
						src={`${assets}/app-didroom.svg`}
					/>
					<div class="space-y-2">
						<Button outline target="_blank" href="https://github.com/ForkbombEu/wallet/">
							{m.Github()}
							<Icon src={ArrowTopRightOnSquare} ml></Icon>
						</Button>
						<Button
							outline
							target="_blank"
							href="https://forkbombeu.github.io/DIDroom/solution.html#wallet-holder-app"
						>
							{m.Help()}
							<Icon src={QuestionMarkCircle} ml></Icon>
						</Button>
					</div>
				</div>
			{:catch error}
				<p class="text-red-500">{JSON.stringify(error)}</p>
			{/await}
		</PageCard>
	</div>
</PageContent>
