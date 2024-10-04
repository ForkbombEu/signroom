<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { goto } from '$lib/i18n';
	import { pb } from '$lib/pocketbase';
	import { A } from 'flowbite-svelte';
	import { Form, createForm, FormError, SubmitButton, Input } from '$lib/forms';
	import { z } from 'zod';
	import { currentEmail } from './+layout.svelte';
	import { m } from '$lib/i18n';

	const schema = z.object({
		email: z.string().email(),
		password: z.string()
	});

	const superform = createForm(
		schema,
		async ({ form }) => {
			const { data } = form;
			const u = pb.collection('users');
			await u.authWithPassword(data.email, data.password);
			await goto('/my');
		},
		{ email: $currentEmail },
		{ taintedMessage: null }
	);

	const { capture, restore, form } = superform;
	export const snapshot = { capture, restore };

	$: $currentEmail = $form.email;
</script>

<Form {superform}>
	<Input
		{superform}
		field="email"
		options={{
			id: 'email',
			type: 'email',
			label: m.Your_email(),
			placeholder: m.namefoundation_org()
		}}
	/>

	<Input
		{superform}
		field="password"
		options={{
			id: 'password',
			type: 'password',
			label: m.Your_password(),
			placeholder: '•••••'
		}}
	>
		<svelte:fragment slot="labelRight">
			<A href="/forgot-password">{m.Forgot_password()}</A>
		</svelte:fragment>
	</Input>

	<FormError />

	<div class="flex justify-end">
		<SubmitButton>{m.Log_in()}</SubmitButton>
	</div>
</Form>
