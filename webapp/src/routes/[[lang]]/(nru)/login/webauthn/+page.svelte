<script lang="ts">
<<<<<<< ours
	import { goto } from '$lib/i18n';
	import { loginUser } from '$lib/webauthn/index';
	import { z } from 'zod';
	import { m } from '$lib/i18n';

	import { Form, createForm, Input, FormError, SubmitButton } from '$lib/forms';
	import { currentEmail } from '../+layout.svelte';
	
=======
	import { goto } from '$app/navigation';
	import { loginUser } from '$lib/webauthn/index';
	import { z } from 'zod';

	import { Form, createForm, Input, FormError, SubmitButton } from '$lib/forms';
	import { currentEmail } from '../+layout.svelte';
>>>>>>> theirs

	const schema = z.object({
		email: z.string().email()
	});

	const superform = createForm(
		schema,
		async ({ form }) => {
			const { data } = form;
			await loginUser(data.email);
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

	<FormError />

	<div class="flex justify-end">
<<<<<<< ours
		<SubmitButton>{m.Log_in_with_webauthn()}</SubmitButton>
=======
		<SubmitButton>Log in with webauthn</SubmitButton>
>>>>>>> theirs
	</div>
</Form>
