<script lang="ts">
	import {
		File,
		Form,
		FormError,
		Input,
		Relations,
		Textarea,
		createForm,
		type SubmitFunction
	} from '$lib/forms';
	import { m } from '$lib/i18n';
	import { Collections, SignaturesTypeOptions } from '$lib/pocketbase/types';
	import { getSignatureFormSchema, type SignatureFormData } from './signatureFormUtils';
	import SubmitButton from '$lib/forms/submitButton.svelte';
	import type { AnyZodObject } from 'zod';
	import { signFileAndUpload } from './sign';

	export let type: SignaturesTypeOptions;
	export let signatureId: string | undefined = undefined;
	export let ownerId: string;
	export let folderId: string | undefined = undefined;

	//

	$: formSchema = getSignatureFormSchema(Boolean(signatureId), Boolean(folderId));

	const onSubmit: SubmitFunction<AnyZodObject> = async ({ form }) => {
		const data = form.data as SignatureFormData;
		await signFileAndUpload(data);
	};

	$: superform = createForm(
		formSchema,
		onSubmit,
		{
			folder: folderId,
			owner: ownerId,
			type
		},
		{ dataType: 'form' }
	);

	//

	$: submitButtonText = signatureId ? m.Update_signature() : m.Sign_file();
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

	<File
		{superform}
		field="file"
		options={{
			label: m.File(),
			accept: type == SignaturesTypeOptions.pades ? 'application/pdf' : '*/*'
		}}
	/>

	<Relations
		{superform}
		field="certificate"
		collection={Collections.Certificates}
		options={{
			inputMode: 'select',
			displayFields: ['name'],
			label: m.Certificate()
		}}
	/>

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
</Form>
