<script lang="ts">
	import {
		File,
		Form,
		Input,
		Relations,
		Textarea,
		createForm,
		type SubmitFunction
	} from '$lib/forms';
	import { m } from '$lib/i18n';
	import { Collections, SignaturesTypeOptions } from '$lib/pocketbase/types';
	import { getSignatureFormSchema } from './signatureFormUtils';
	import SubmitButton from '$lib/forms/submitButton.svelte';
	import type { AnyZodObject } from 'zod';

	export let type: SignaturesTypeOptions;
	export let signatureId: string | undefined = undefined;
	export let ownerId: string;
	export let folderId: string | undefined = undefined;

	//

	$: formSchema = getSignatureFormSchema(Boolean(signatureId), Boolean(folderId));
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

	const onSubmit: SubmitFunction<AnyZodObject> = ({ form }) => {
		console.log(form.data);
	};

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

	<div class="flex justify-end">
		<SubmitButton>{submitButtonText}</SubmitButton>
	</div>
</Form>
