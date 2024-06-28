<script lang="ts">
	import {
		Form,
		Input,
		createForm,
		zodFile,
		File as FileInput,
		FormError,
		SubmitButton
	} from '$lib/forms';
	import { addCertifcateAndKey } from '$lib/signatures/certificates';
	import { readFileAsString } from '$lib/utils/files';
	import { nanoid } from 'nanoid';
	import { z } from 'zod';

	const schema = z.object({
		name: z.string(),
		certificate: zodFile(),
		key: zodFile()
	});

	const superform = createForm(
		schema,
		async ({ form }) => {
			const { data } = form;
			const certificate = await readFileAsString(data.certificate);
			const key = await readFileAsString(data.key);
			// await addCertifcateAndKey(data.name, certificate, key, $currentUser!.id);
		},
		undefined,
		{
			id: nanoid(5),
			dataType: 'form'
		}
	);
</script>

<Form {superform}>
	<Input {superform} field="name" options={{ id: 'name', label: 'Insert your certificate name' }} />

	<FileInput
		{superform}
		field="certificate"
		options={{ id: 'certificate', label: 'Select your certificate' }}
	/>

	<FileInput {superform} field="key" options={{ id: 'key', label: 'Select your key' }} />

	<FormError />

	<dir class="flex justify-end">
		<SubmitButton>Submit certificate and key</SubmitButton>
	</dir>
</Form>
