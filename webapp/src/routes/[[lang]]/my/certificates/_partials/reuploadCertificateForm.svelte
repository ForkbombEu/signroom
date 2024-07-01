<script lang="ts">
	import {
		Form,
		createForm,
		zodFile,
		File as FileInput,
		FormError,
		SubmitButton
	} from '$lib/forms';
	import { parseCertificateData } from '$lib/certificates/parse';
	import { saveCertificateInLocalStorage } from '$lib/certificates/storage';
	import { readFileAsString } from '$lib/utils/files';
	import { nanoid } from 'nanoid';
	import { z } from 'zod';
	import { m } from '$lib/i18n';

	//

	export let certificateName: string;
	export let onComplete = () => {};

	//

	let schema = z.object({
		certificate: zodFile(),
		key: zodFile()
	});

	let superform = createForm(
		schema,
		async ({ form }) => {
			const { data } = form;
			const certificate = await readFileAsString(data.certificate);
			const key = await readFileAsString(data.key);
			const certificateData = await parseCertificateData(certificate, key);
			saveCertificateInLocalStorage(certificateName, certificateData);
			onComplete();
		},
		undefined,
		{
			id: nanoid(5),
			dataType: 'form'
		}
	);
</script>

<Form {superform}>
	<FileInput
		{superform}
		field="certificate"
		options={{ id: 'certificate', label: m.Select_your_certificate() }}
	/>

	<FileInput {superform} field="key" options={{ id: 'key', label: m.Select_your_key() }} />

	<FormError />

	<dir class="flex justify-end">
		<SubmitButton>{m.Save_certificate_and_key()}</SubmitButton>
	</dir>
</Form>
