<script lang="ts">
	import { pb } from '$lib/pocketbase';
<<<<<<< ours
	import { Collections, OrgJoinRequestsStatusOptions } from '$lib/pocketbase/types';
	import { goto, m } from '$lib/i18n';
=======
	import { Collections } from '$lib/pocketbase/types';
	import { goto } from '$app/navigation';
>>>>>>> theirs
	import { z } from 'zod';

	import { A, Heading, Hr, P } from 'flowbite-svelte';
	import { Form, createForm, Input, Checkbox, FormError, SubmitButton } from '$lib/forms';
<<<<<<< ours
	import { page } from '$app/stores';
	import { welcomeSearchParam } from '$lib/utils/constants';

	const url = $page.url;

	const join = url.searchParams.get('join');
=======
	import { welcomeSearchParam } from '$lib/utils/constants';

>>>>>>> theirs
	//

	const schema = z
		.object({
<<<<<<< ours
			name: z.string(),
=======
>>>>>>> theirs
			email: z.string().email(),
			password: z.string().min(8),
			passwordConfirm: z.string().min(8),
			acceptTerms: z.boolean()
		})
<<<<<<< ours
		.refine((data) => data.password === data.passwordConfirm, m.PASSWORDS_DO_NOT_MATCH());
=======
		.refine((data) => data.password === data.passwordConfirm, 'PASSWORDS_DO_NOT_MATCH');
>>>>>>> theirs

	const superform = createForm(schema, async ({ form }) => {
		const { data } = form;
		const u = pb.collection(Collections.Users);
		await u.create(data);
<<<<<<< ours
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
=======
		await u.authWithPassword(data.email, data.password);
		await u.requestVerification(data.email);
		window.location.assign(`/my?${welcomeSearchParam}`);
		// Somehow, using `goto` doesn't always keep the search parameters
>>>>>>> theirs
	});
</script>

<Heading tag="h4">Create an account</Heading>

<Form {superform}>
	<Input
		{superform}
		field="email"
		options={{
			type: 'email',
<<<<<<< ours
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
=======
			label: 'Your email',
			placeholder: 'name@example.org'
>>>>>>> theirs
		}}
	/>

	<Input
		{superform}
		field="password"
		options={{
			type: 'password',
<<<<<<< ours
			label: m.Your_password(),
=======
			label: 'Your password',
>>>>>>> theirs
			placeholder: '•••••'
		}}
	/>

	<Input
		{superform}
		field="passwordConfirm"
		options={{
			type: 'password',
<<<<<<< ours
			label: m.Confirm_password(),
=======
			label: 'Confirm password',
>>>>>>> theirs
			placeholder: '•••••'
		}}
	/>

	<Checkbox {superform} field="acceptTerms">
<<<<<<< ours
		{m.I_accept_the()}<A class="ml-1" href="/">{m.Terms_and_Conditions()}</A>
=======
		I accept the<A class="ml-1" href="/">Terms and Conditions</A>
>>>>>>> theirs
	</Checkbox>

	<FormError />

	<div class="flex justify-end">
<<<<<<< ours
		<SubmitButton>{m.Create_an_account()}</SubmitButton>
=======
		<SubmitButton>Create an account</SubmitButton>
>>>>>>> theirs
	</div>
</Form>

<div class="flex flex-col items-center gap-4">
	<Hr />
	<P color="text-gray-500 dark:text-gray-400" size="sm">
<<<<<<< ours
		{m.Already_have_an_account()}
		<A href="/login">{m.Login_here()}</A>
=======
		Already have an account?
		<A href="/login">Login here</A>
>>>>>>> theirs
	</P>
</div>
