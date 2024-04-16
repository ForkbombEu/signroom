<script lang="ts">
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
	import { pipe } from 'effect';
	import type { TemplatesResponse } from '$lib/pocketbase/types.js';
	import { ProtectedOrgUI } from '$lib/rbac';

	//

	export let data;
	let { verificationFlow, organization } = data;
	let { template, relying_party } = verificationFlow.expand!;

	//

	async function generateVerificationFlowQr() {
		const { result } = await generateQr(
			JSON.stringify({
				// TODO – Review
				credential_configuration_ids: [verificationFlow.name],
				credential_issuer: relying_party.endpoint
			})
		);
		return result.qrcode as string;
	}

	//

	const propertyList = getTemplatePropertyList(template);

	function getTemplatePropertyList(template: TemplatesResponse) {
		return pipe(
			template.schema as ObjectSchema,
			objectSchemaToCredentialSubject,
			flattenCredentialSubjectProperties
		);
	}
</script>

<PageTop>
	<OrganizationBreadcrumbs />
	<SectionTitle title={verificationFlow.name} description={verificationFlow.description} />
</PageTop>

<PageContent>
	<div class="flex gap-8 items-start">
		<PageCard class="grow">
			<SectionTitle tag="h5" title={m.Verification_flow_details()}>
				<ProtectedOrgUI slot="right" orgId={organization.id} roles={['admin', 'owner']}>
					<Button href={`${$page.url.pathname}/edit`}>
						{m.Make_changes()}
						<Icon src={Pencil} ml />
					</Button>
				</ProtectedOrgUI>
			</SectionTitle>

			<div class="font-medium space-y-8">
				<!-- <div class="flex gap-3 items-center pb-1">
					<p>Logo:</p>
					<Avatar class="object-cover border" size="lg" src={verificationFlow.logo}></Avatar>
				</div> -->

				<p>
					{m.Relying_party()}:
					<span class="text-primary-700">{relying_party.endpoint}</span>
				</p>

				<div class="space-y-2">
					<p>
						{m.Verification_template()}:
						<span class="text-primary-700">{template.name}</span>
					</p>
					<div class="divide-y bg-gray-50 border rounded-lg">
						{#each propertyList as [propertyId, property]}
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
			</div>
		</PageCard>

		<PageCard class="!p-4 shrink-0">
			{#await generateVerificationFlowQr()}
				<Spinner />
			{:then qrimg}
				<div class="flex flex-col">
					<div
						class="self-stretch border rounded-lg flex flex-col items-center p-4 bg-gray-50 gap-2"
					>
						<p class="font-semibold text-xl">{verificationFlow.name}</p>
						<img src={qrimg} alt={m.Service_Qr_Code()} class="rounded-md" />
					</div>

					<div class="mt-6 space-y-1">
						<p class="font-semibold">{m.This_is_a_verification_flow()}</p>
						<p class="max-w-[200px] text-sm text-gray-500">{m.verification_flow_description()}</p>
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
