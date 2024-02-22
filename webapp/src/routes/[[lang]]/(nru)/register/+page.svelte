<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { Collections, OrgJoinRequestsStatusOptions } from '$lib/pocketbase/types';
	import { goto } from '$lib/i18n';
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
			email: z.string().email(),
			password: z.string().min(8),
			passwordConfirm: z.string().min(8),
			acceptTerms: z.boolean()
		})
		.refine((data) => data.password === data.passwordConfirm, 'PASSWORDS_DO_NOT_MATCH');

	const superform = createForm(schema, async ({ form }) => {
		const { data } = form;
		const u = pb.collection(Collections.Users);
		await u.create(data);
		const { record } = await u.authWithPassword(data.email, data.password);
		await u.requestVerification(data.email);
		//Join organization
		if (Boolean(join)) {
			await pb.collection(Collections.OrgJoinRequests).create({
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
			label: 'Your email',
			placeholder: 'name@example.org'
		}}
	/>

	<Input
		{superform}
		field="password"
		options={{
			type: 'password',
			label: 'Your password',
			placeholder: '•••••'
		}}
	/>

	<Input
		{superform}
		field="passwordConfirm"
		options={{
			type: 'password',
			label: 'Confirm password',
			placeholder: '•••••'
		}}
	/>

	<Checkbox {superform} field="acceptTerms">
		I accept the<A class="ml-1" href="/">Terms and Conditions</A>
	</Checkbox>

	<FormError />

	<div class="flex justify-end">
		<SubmitButton>Create an account</SubmitButton>
	</div>
</Form>

<div class="flex flex-col items-center gap-4">
	<Hr />
	<P color="text-gray-500 dark:text-gray-400" size="sm">
		Already have an account?
		<A href="/login">Login here</A>
	</P>
</div>