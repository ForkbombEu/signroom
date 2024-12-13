<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { Form, Input, createForm, FormError, SubmitButton } from '$lib/forms';
	import { createAutosignedCertificateData } from '$lib/certificates/autosigned-certificate';
	import { saveCertificate } from '$lib/certificates/storage';
	import { nanoid } from 'nanoid';
	import { z } from 'zod';
	import { currentUser } from '$lib/pocketbase';
	import { getUserPublicKeys } from '$lib/keypairoom/utils';
	import { m } from '$lib/i18n';

	export let onComplete = () => {};

	const schema = z.object({
		name: z.string()
	});

	const superform = createForm(
		schema,
		async ({ form }) => {
			const { data } = form;
			const userPublicKeys = await getUserPublicKeys();
			const eddsaPublicKey = userPublicKeys?.eddsa_public_key;
			const certificateData = await createAutosignedCertificateData($currentUser!.name, `did:dyne:sandbox.signroom:${eddsaPublicKey}`);
			await saveCertificate(data.name, certificateData, $currentUser!.id);
			onComplete();
		},
		undefined,
		{
			id: nanoid(5)
		}
	);
</script>

<Form {superform}>
	<Input {superform} field="name" options={{ id: 'name', label: m.Certificate_name() }} />

	<FormError />

	<dir class="flex justify-end">
		<SubmitButton>{m.Save_certificate_and_key()}</SubmitButton>
	</dir>
</Form>
