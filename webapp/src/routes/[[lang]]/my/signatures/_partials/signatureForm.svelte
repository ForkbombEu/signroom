<script lang="ts">
	import {
		File,
		Form,
		FormError,
		Input,
		Relations,
		Textarea,
		createForm,
		Select,
		type SubmitFunction
	} from '$lib/forms';
	import { m } from '$lib/i18n';
	import { Collections, SignaturesTypeOptions, type SignaturesRecord } from '$lib/pocketbase/types';
	import { getSignatureFormSchema, type SignatureFormData } from './signatureFormUtils';
	import SubmitButton from '$lib/forms/submitButton.svelte';
	import type { AnyZodObject } from 'zod';
	import { signFileAndUpload } from './sign';
	import { Alert, P } from 'flowbite-svelte';
	import { pb } from '$lib/pocketbase';
	import { getCertificate, getCertificatesFromLocalStorage } from '$lib/certificates/storage';
	import { isInvalidCertificate } from '$lib/signatures/guards';
	import { getInvalidCertificates } from './utils';

	export let type: SignaturesTypeOptions;
	export let signatureId: string | undefined = undefined;
	export let ownerId: string;
	export let folderId: string | undefined = undefined;
	export let onSubmit: () => Promise<void> | void = () => {};
	export let initialData: Partial<SignaturesRecord> = {};

	//

	$: formSchema = getSignatureFormSchema(Boolean(signatureId), Boolean(folderId));

	const handleSubmit: SubmitFunction<AnyZodObject> = async ({ form }) => {
		const data = form.data as SignatureFormData;
		const certificate = getCertificate(data.certificate);
		if (!signatureId) await signFileAndUpload(data, certificate);
		else await pb.collection('signatures').update(signatureId, form.data);
		await onSubmit();
	};

	$: initialFormData = {
		...initialData,
		folder: folderId,
		owner: ownerId,
		type
	};

	$: superform = createForm(formSchema, handleSubmit, initialFormData, {
		dataType: 'form'
	});

	//

	$: submitButtonText = signatureId ? m.Update_signature() : m.Sign_file();

	//

	$: certificatesOptions = Object.entries(getCertificatesFromLocalStorage())
		.filter(([_, certificateData]) => !isInvalidCertificate(type, certificateData))
		.map(([certificateName, _]) => certificateName);

	$: invalidCertificates = getInvalidCertificates(type);
</script>

<Form {superform} showRequiredIndicator>
	<Input
		{superform}
		field="title"
		options={{
			label: m.Title()
		}}
	/>

	<Textarea
		{superform}
		field="description"
		options={{
			label: m.Description()
		}}
	/>

	{#if !signatureId}
		<File
			{superform}
			field="file"
			options={{
				label: m.File(),
				accept: type == SignaturesTypeOptions.pades ? 'application/pdf' : '*/*'
			}}
		/>

		<div>
			<Select {superform} field="certificate" options={{ options: certificatesOptions }} />
			{#if invalidCertificates.length > 0}
				<Alert color="yellow" class="mt-2" border>
					<p class="font-bold">{m.Warning()}</p>
					<p>{m.ECDSA_and_EdDSA_certificates_are_currently_not_supported_with_JADES_algorithm()}</p>
					<p>{m.These_certificates_cannot_be_used()}</p>
					<ul class="list-inside list-disc">
						{#each invalidCertificates as certificate}
							<li>{certificate}</li>
						{/each}
					</ul>
				</Alert>
			{/if}
		</div>
	{/if}

	<Relations
		{superform}
		field="folder"
		collection={Collections.Folders}
		options={{
			inputMode: 'select',
			displayFields: ['name'],
			label: m.folder()
		}}
	/>

	<FormError />

	<div class="flex justify-end">
		<SubmitButton>{submitButtonText}</SubmitButton>
	</div>

	<svelte:fragment slot="loadingModalContent" let:Spinner>
		<div class="gap- mx-auto flex flex-col items-center">
			<Spinner />
			<P>We are signing your file.</P>
			<P>Please don't leave the page.</P>
		</div>
	</svelte:fragment>
</Form>
