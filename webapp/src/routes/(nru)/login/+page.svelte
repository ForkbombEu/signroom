<script lang="ts">
	import { goto } from '$app/navigation';
	import { pb } from '$lib/pocketbase';
	import { Collections } from '$lib/pocketbase-types';
	import { Heading } from 'flowbite-svelte';
	import Form, { createForm } from '$lib/components/forms/form.svelte';
	import Input from '$lib/components/forms/input.svelte';
	import { z } from 'zod';
	import FormError from '$lib/components/forms/formError.svelte';
	import SubmitButton from '$lib/components/forms/submitButton.svelte';

	const schema = z.object({
		email: z.string().email(),
		password: z.string()
	});

	const superform = createForm(schema, async ({ form }) => {
		const { data } = form;
		const u = pb.collection(Collections.Users);
		await u.authWithPassword(data.email, data.password);
		await goto('/my');
	});
	const keys = schema.keyof().Enum;

	const { capture, restore } = superform;
	export const snapshot = { capture, restore };
</script>

<Form {superform}>
	<Heading tag="h4">Log in</Heading>
	<Input
		id="email"
		type="email"
		label="Your email"
		field={keys.email}
		placeholder="name@foundation.org"
	/>
	<Input
		id="password"
		type="password"
		label="Your password"
		field={keys.password}
		placeholder="•••••"
	/>
	<FormError />
	<div class="flex justify-end">
		<SubmitButton>Log in</SubmitButton>
	</div>
</Form>
