<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { Collections } from '$lib/pocketbase-types';
	import { goto } from '$app/navigation';

	// Components
	import { A, Heading } from 'flowbite-svelte';
	import Form, { createForm } from '$lib/components/forms/form.svelte';
	import Input from '$lib/components/forms/input.svelte';
	import Checkbox from '$lib/components/forms/checkbox.svelte';
	import { z } from 'zod';

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
		await goto('/my/keypairoom');
	});
	const keys = schema.innerType().keyof().Enum;

	const { capture, restore } = superform;
	export const snapshot = { capture, restore };
</script>

<Form {superform} defaultSubmitButtonText="Create an account">
	<Heading tag="h3">Create an account</Heading>

	<Input type="email" label="Your email" field={keys.email} placeholder="name@company.com" />
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
</Form>

<p class="text-sm text-gray-500 dark:text-gray-400">
	Already have an account?
	<A href="/login">Login here</A>
</p>
