<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { Button, Heading } from 'flowbite-svelte';
	import { ArrowTopRightOnSquare, Pencil, QuestionMarkCircle } from 'svelte-heros-v2';
	import { createIntentUrl, generateQr } from '$lib/qrcode';
	import { m } from '$lib/i18n';
	import PageTop from '$lib/components/pageTop.svelte';
	import PageContent from '$lib/components/pageContent.svelte';
	import PageCard from '$lib/components/pageCard.svelte';
	import OrganizationBreadcrumbs from '$lib/components/organizationBreadcrumbs.svelte';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import Icon from '$lib/components/icon.svelte';
	import { page } from '$app/stores';
	import { Avatar } from 'flowbite-svelte';
	import { ProtectedOrgUI } from '$lib/organizations';
	import TemplateSchemaDisplay from '$lib/components/templateSchemaDisplay.svelte';
	import { assets } from '$app/paths';

	//

	export let data;
	let { service, organization } = data;
	let { credential_issuer, credential_template, authorization_server, authorization_template } =
		service.expand!;

	//

	const issuanceFlowQr = generateQr(
		createIntentUrl({
			credential_configuration_ids: [service.type_name],
			credential_issuer: credential_issuer.endpoint,
			grants: {
				authorization_code: {
					authorization_server: authorization_server.endpoint
				}
			}
		})
	);

	const appsQr = generateQr('https://didroom.com/apps/');

	//

	// async function downloadCredentialIssuanceQr(src: string) {
	// 	const imgBlob = await imageSrcToBlob(src);
	// 	downloadBlob(imgBlob, `credential-issuance-qr.png`);
	// }

	let microservicesTemplates = [
		{
			label: m.Credential_template(),
			name: credential_template?.name,
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
	<OrganizationBreadcrumbs />

	<SectionTitle title={service.display_name} description={service.description} />
</PageTop>

<PageContent>
	<div class="flex items-start gap-8">
		<PageCard class="grow">
			<SectionTitle tag="h5" title={m.Credential_details()}>
				<div slot="right" class="flex items-center gap-2">
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
					<d-avatar name={service.display_name} src={service.logo} size="xl" shape="square" />
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

		<PageCard class="w-[300px] shrink-0 !space-y-6 !p-4">
			<div class="space-y-3">
				<Heading tag="h6" class="text-balance leading-tight">
					{m.Test_the_credential_with_this_QR_code()}
				</Heading>
				<p class="text-sm text-gray-500">
					{m.Use_the_mobile_app_to_scan_this_QR_code_and_test_the_credential()}
				</p>
				<div class="flex flex-col items-center gap-2 self-stretch rounded-lg border bg-gray-50 p-4">
					<img src={issuanceFlowQr} alt={m.Service_Qr_Code()} class="w-40 rounded-lg" />
					<Button outline class="mt-4" size="sm" disabled>
						<span class="whitespace-nowrap">
							{m.Open_qr_code_in_new_page()}
						</span>
						<Icon src={ArrowTopRightOnSquare} ml></Icon>
					</Button>
				</div>
			</div>

			<hr />

			<div class="mt-6 space-y-3">
				<div class="flex gap-4">
					<div class="space-y-2">
						<Heading tag="h6" class="text-balance leading-tight">
							{m.Get_the_mobile_app()}
						</Heading>
						<p class="text-sm text-gray-500">{m.Get_the_mobile_app_description()}</p>
					</div>
					<img
						alt="Didroom Wallet app logo"
						class="size-16 rounded-lg"
						src={`${assets}/app-didroom.svg`}
					/>
				</div>
				<div class="flex flex-col items-center gap-2 self-stretch rounded-lg border bg-gray-50 p-4">
					<img src={appsQr} alt={m.Mobile_app_QR_code()} class="w-40 rounded-lg" />
				</div>
			</div>

			<div class="flex gap-2">
				<Button class="grow" outline target="_blank" href="https://github.com/ForkbombEu/wallet/">
					{m.Github()}
					<Icon src={ArrowTopRightOnSquare} ml></Icon>
				</Button>
				<Button
					class="grow"
					outline
					target="_blank"
					href="https://forkbombeu.github.io/DIDroom/solution.html#wallet-holder-app"
				>
					{m.Help()}
					<Icon src={QuestionMarkCircle} ml></Icon>
				</Button>
			</div>
		</PageCard>
	</div>
</PageContent>
