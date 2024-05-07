<script lang="ts">
	import {
		Form,
		createForm,
		SubmitButton,
		FormError,
		Input,
		Relations,
		Textarea
	} from '$lib/forms';

	import { assets } from '$app/paths';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import { ArrowRight } from 'svelte-heros-v2';
	import SideCard from '$lib/components/sideCard.svelte';
	import { multisignatureFormData, setupSchema } from '../logic';
	import { Collections, type CoconutCredentialIssuersResponse } from '$lib/pocketbase/types';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { Fileupload } from 'flowbite-svelte';
	import FieldWrapper from '$lib/forms/fields/fieldParts/fieldWrapper.svelte';
	import { goto } from '$lib/i18n';
	import PageContent from '$lib/components/pageContent.svelte';
	import PageTop from '$lib/components/pageTop.svelte';
	import PageCard from '$lib/components/pageCard.svelte';

	const superform = createForm(
		setupSchema,
		async ({ form }) => {
			multisignatureFormData.update((data) => ({ ...data, ...form.data }));
			await goto('/my/multisignatures/create/participants');
		},
		$multisignatureFormData
	);

	const credentialIssuerType = createTypeProp<CoconutCredentialIssuersResponse>();
</script>

<PageTop>
	<SectionTitle
		title="Setup multisignature content"
		description="This page guides users through a three-step process to create a multi-signature."
	/>
</PageTop>

<Form {superform} className="space-y-0 space-x-0">
	<PageContent class="flex gap-8 items-start !space-y-0">
		<div class="space-y-8 grow">
			<PageCard>
				<SectionTitle tag="h5" title="Name" />
				<Input
					{superform}
					field="name"
					options={{
						label: 'Signature name',
						placeholder: 'Enter the name of the multi-signature',
						helpText: 'Provide a descriptive name for the multi-signature'
					}}
				/>
			</PageCard>

			<PageCard>
				<SectionTitle
					tag="h5"
					title="Credential issuer"
					description="Choose the issuer responsible for generating cryptographic signatures."
				/>
				<Relations
					{superform}
					field="credentialIssuer"
					collection={Collections.CoconutCredentialIssuers}
					recordType={credentialIssuerType}
					options={{
						label: 'Select zero knowledge proof (Coconut) credential issuer:',
						inputMode: 'select',
						displayFields: ['name', 'endpoint']
					}}
				/>
			</PageCard>

			<PageCard>
				<SectionTitle tag="h5" title="Signature content / Reflow seal" />
				<Textarea
					{superform}
					field="contentJSON"
					options={{
						label: 'Paste JSON:',
						class: 'font-mono',
						placeholder: '// Paste here ...',
						helpText: 'Input the JSON data representing the signature content.'
					}}
				/>

				<div class="opacity-40">
					<FieldWrapper
						field=""
						label="Upload document(s) to sign:"
						helpText="Homomorphic multisignature for documents (upcoming) "
					>
						<Fileupload />
					</FieldWrapper>
				</div>
			</PageCard>

			<PageCard>
				<SectionTitle tag="h5" title="Settings" />
				<div class="space-y-4">
					<Input
						{superform}
						field="sealExpirationDate"
						options={{
							label: 'Deadline for signing',
							placeholder: 'Enter a date',
							helpText: 'Date must be formatted as YYYY-MM-DD'
						}}
					/>
					<ul class="list-disc pl-4 text-sm text-gray-700">
						<li>For success, all participants must sign the Reflow seal before the expiry date.</li>
						<li>Failure occurs if not all signatures are collected by the expiry date.</li>
						<li>Both success and failure will be communicated to invitees and the organizer</li>
					</ul>
				</div>
			</PageCard>
		</div>

		<SideCard
			title="Setup content"
			description="In the first step, users set up the content for the multi-signature by providing necessary details."
			image={`${assets}/multisignatures/multisignature-step-1.svg`}
		>
			<svelte:fragment slot="top">
				<SectionTitle title="Step 1 of 3" tag="h6" />
			</svelte:fragment>
			<svelte:fragment slot="bottom">
				<FormError />
				<SubmitButton>
					<span class="mr-2">Confirm content</span><ArrowRight />
				</SubmitButton>
			</svelte:fragment>
		</SideCard>
	</PageContent>
</Form>
