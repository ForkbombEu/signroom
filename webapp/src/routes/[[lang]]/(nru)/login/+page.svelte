<script lang="ts">
<<<<<<< ours
	import { goto } from '$lib/i18n';
	import { pb } from '$lib/pocketbase';
	import { Collections } from '$lib/pocketbase/types';
	import { A } from 'flowbite-svelte';
	import { Form, createForm, FormError, SubmitButton, Input } from '$lib/forms';
	import { z } from 'zod';
	import { currentEmail } from './+layout.svelte';
	import { m } from '$lib/i18n';
=======
	import { goto } from '$app/navigation';
	import { pb } from '$lib/pocketbase';
	import { Collections } from '$lib/pocketbase/types';
	import { Form, createForm, FormError, SubmitButton, Input } from '$lib/forms';
	import { z } from 'zod';
	import { currentEmail } from './+layout.svelte';
>>>>>>> theirs

	const schema = z.object({
		email: z.string().email(),
		password: z.string()
	});

	const superform = createForm(
		schema,
		async ({ form }) => {
			const { data } = form;
			const u = pb.collection(Collections.Users);
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
<<<<<<< ours
			label: m.Your_email(),
			placeholder: m.namefoundation_org()
=======
			label: 'Your email',
			placeholder: 'name@foundation.org'
>>>>>>> theirs
		}}
	/>

	<Input
		{superform}
		field="password"
		options={{
			id: 'password',
			type: 'password',
<<<<<<< ours
			label: m.Your_password(),
			placeholder: '•••••'
		}}
	>
		<svelte:fragment slot="labelRight">
			<A href="/forgot-password">{m.Forgot_password()}</A>
		</svelte:fragment>
	</Input>
=======
			label: 'Your password',
			placeholder: '•••••'
		}}
	/>
>>>>>>> theirs

	<FormError />

	<div class="flex justify-end">
<<<<<<< ours
		<SubmitButton>{m.Log_in()}</SubmitButton>
=======
		<SubmitButton>Log in</SubmitButton>
>>>>>>> theirs
	</div>
</Form>
