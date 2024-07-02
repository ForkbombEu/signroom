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
	import { P } from 'flowbite-svelte';
	import { pb } from '$lib/pocketbase';
	import { getCertificate, getCertificatesFromLocalStorage } from '$lib/certificates/storage';

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

	const certificatesOptions = Object.entries(getCertificatesFromLocalStorage()).map(
		([certificateName, _]) => certificateName
	);
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

		<Select {superform} field="certificate" options={{ options: certificatesOptions }}></Select>
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
