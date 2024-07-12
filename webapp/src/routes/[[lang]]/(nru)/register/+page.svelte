<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { OrgJoinRequestsStatusOptions } from '$lib/pocketbase/types';
	import { goto, m } from '$lib/i18n';
	import { z } from 'zod';

	import { A, Heading, Hr, P } from 'flowbite-svelte';
	import { Form, createForm, Input, Checkbox, FormError, SubmitButton } from '$lib/forms';
	import { page } from '$app/stores';
	import { welcomeSearchParam } from '$lib/utils/constants';

	const url = $page.url;

	const join = url.searchParams.get('join');
	//

	const schema = z
		.object({
			name: z.string(),
			email: z.string().email(),
			password: z.string().min(8),
			passwordConfirm: z.string().min(8),
			acceptTerms: z.boolean()
		})
		.refine((data) => data.password === data.passwordConfirm, m.PASSWORDS_DO_NOT_MATCH());

	const superform = createForm(schema, async ({ form }) => {
		const { data } = form;
		const u = pb.collection('users');
		await u.create(data);
		const { record } = await u.authWithPassword(data.email, data.password);
		await u.requestVerification(data.email);
		//Join organization
		if (Boolean(join)) {
			await pb.collection('orgJoinRequests').create({
				user: record.id,
				organization: join,
				status: OrgJoinRequestsStatusOptions.pending,
				reminders: 0
			});
			await goto('/keypairoom?joined=true');
			return;
		}

		window.location.assign(`/my?${welcomeSearchParam}`);
	});
</script>

<Heading tag="h4">Create an account</Heading>

<Form {superform}>
	<Input
		{superform}
		field="email"
		options={{
			type: 'email',
			label: m.Your_email(),
			placeholder: m.namefoundation_org()
		}}
	/>

	<Input
		{superform}
		field="name"
		options={{
			type: 'text',
			label: m.Full_name(),
			placeholder: m.John_Doe(),
			helpText: m.Organizations_and_other_users_will_identify_you_by_your_name_()
		}}
	/>

	<Input
		{superform}
		field="password"
		options={{
			type: 'password',
			label: m.Your_password(),
			placeholder: '•••••'
		}}
	/>

	<Input
		{superform}
		field="passwordConfirm"
		options={{
			type: 'password',
			label: m.Confirm_password(),
			placeholder: '•••••'
		}}
	/>

	<Checkbox {superform} field="acceptTerms">
		{m.I_accept_the()}<A class="ml-1" href="/">{m.Terms_and_Conditions()}</A>
	</Checkbox>

	<FormError />

	<div class="flex justify-end">
		<SubmitButton>{m.Create_an_account()}</SubmitButton>
	</div>
</Form>

<div class="flex flex-col items-center gap-4">
	<Hr />
	<P color="text-gray-500 dark:text-gray-400" size="sm">
		{m.Already_have_an_account()}
		<A href="/login">{m.Login_here()}</A>
	</P>
</div>
