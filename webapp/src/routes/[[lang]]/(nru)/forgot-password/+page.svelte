<script lang="ts">
	import { Collections } from '$lib/pocketbase/types';
	import { pb } from '$lib/pocketbase';
	import { Heading, P, Hr, A } from 'flowbite-svelte';
	import { goto, m } from '$lib/i18n';
	import Icon from '$lib/components/icon.svelte';
	import { ArrowLeft } from 'svelte-heros-v2';
	import {
		createForm,
		Form,
		FormError,
		SubmitButton,
		Input,
		type SubmitFunction
	} from '$lib/forms';
	import { z } from 'zod';

	//

	const schema = z.object({
		email: z.string().email()
	});

	const onSubmit: SubmitFunction<typeof schema> = async ({ form }) => {
		await pb.collection(Collections.Users).requestPasswordReset(form.data.email);
		await goto('/forgot-password/confirm');
	};

	const superform = createForm(schema, onSubmit);
</script>

<Form {superform}>
	<div class="space-y-2">
		<A href="/login"><Icon src={ArrowLeft} mr />{m.Login()}</A>
		<Hr />
	</div>

	<div class="space-y-2">
		<Heading tag="h4">{m.Forgot_password()}</Heading>
		<P>{m.Please_enter_here_your_email_to_recover_your_password_()}</P>
	</div>

	<Input
		{superform}
		field="email"
		options={{ type: 'email', placeholder: 'user@example.org', label: m.Your_email() }}
	/>

	<FormError />

	<div class="flex justify-end">
		<SubmitButton>{m.Reset_password()}</SubmitButton>
	</div>
</Form>
