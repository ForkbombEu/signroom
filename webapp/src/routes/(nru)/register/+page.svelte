<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { Collections } from '$lib/pocketbase/types';
	import { goto } from '$app/navigation';
	import { featureFlags } from '$lib/features';
	import { z } from 'zod';

	// Components
	import { A, Heading } from 'flowbite-svelte';
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

<Form {superform}>
	<Heading tag="h3">Create an account</Heading>

	<Input type="email" label="Your email" field={keys.email} placeholder="name@foundation.org" />
	<Input type="password" label="Your password" field={keys.password} placeholder="•••••" />
	<Input
		type="password"
		label="Confirm password"
		field={keys.passwordConfirm}
		placeholder="•••••"
	/>
	<Checkbox field={keys.acceptTerms}>
		I accept the <A href="/">Terms and Conditions</A>
	</Checkbox>

	<FormError />
	<div class="flex justify-end">
		<SubmitButton>Create an account</SubmitButton>
	</div>
</Form>

<p class="text-sm text-gray-500 dark:text-gray-400">
	Already have an account?
	<A href="/login">Login here</A>
</p>
