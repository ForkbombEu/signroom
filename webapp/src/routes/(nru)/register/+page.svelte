<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { Collections } from '$lib/pocketbase/types';
	import { goto } from '$app/navigation';
	import { featureFlags } from '$lib/features';
	import { z } from 'zod';

	// Components
	import { A, Heading, Hr, P } from 'flowbite-svelte';
	import { Form, createForm, Input, Checkbox, FormError, SubmitButton } from '$lib/forms';

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
		await u.authWithPassword(data.email, data.password);
		await u.requestVerification(data.email);
		if ($featureFlags.KEYPAIROOM) {
			await goto('/keypairoom');
		} else {
			await goto('/my');
		}
	});

	const keys = schema.innerType().keyof().Enum;

	const { capture, restore } = superform;
	export const snapshot = { capture, restore };
</script>

<Heading tag="h4">Create an account</Heading>

<Form {superform}>
	<Input type="email" label="Your email" field={keys.email} placeholder="name@example.org" />
	<Input type="password" label="Your password" field={keys.password} placeholder="•••••" />
	<Input
		type="password"
		label="Confirm password"
		field={keys.passwordConfirm}
		placeholder="•••••"
	/>
	<Checkbox field={keys.acceptTerms}>
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
