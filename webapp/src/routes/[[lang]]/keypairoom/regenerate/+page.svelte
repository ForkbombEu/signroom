<script lang="ts">
	import { getHMAC, regenerateKeypair, saveKeyringToLocalStorage } from '$lib/keypairoom/keypair';
	import { currentUser } from '$lib/pocketbase';

	import { z } from 'zod';
	import { Form, createForm, FormError, SubmitButton, Textarea, Input } from '$lib/forms';
	import { A, Alert, Heading, Hr, P } from 'flowbite-svelte';
	import Card from '$lib/components/card.svelte';
	import { page } from '$app/stores';
	import { missingKeyringParam, missingKeyringParamKey } from '$lib/utils/constants.js';
	import { ExclamationTriangle } from 'svelte-heros-v2';
<<<<<<< ours
	import { m } from '$lib/i18n';
=======
>>>>>>> theirs

	//

	let success = false;

	const schema = z.object({
		email: z.string().email(),
		seed: z.string()
	});

	const superform = createForm(schema, async ({ form }) => {
		const hmac = await getHMAC(form.data.email);
		const keypair = await regenerateKeypair(form.data.seed, hmac);
		saveKeyringToLocalStorage(keypair.keyring);
		success = true;
	});

	const { capture, restore, form } = superform;
	export const snapshot = { capture, restore };

	if ($currentUser) $form.email = $currentUser.email;

	const textAreaPlaceholder =
		'skin buyer sunset person run push elevator under debris soft surge man';

	$: isKeyringMissing = $page.url.searchParams.has(missingKeyringParamKey);
</script>

<Card class="p-6 space-y-6">
	{#if !success}
<<<<<<< ours
		<Heading tag="h4">{m.Regenerate_keys()}</Heading>
=======
		<Heading tag="h4">Regenerate keys</Heading>
>>>>>>> theirs

		{#if isKeyringMissing}
			<Alert color="yellow" border>
				<svelte:fragment slot="icon"><ExclamationTriangle /></svelte:fragment>
				<div class="space-y-1">
<<<<<<< ours
					<p>{m.You_have_been_redirected_here_because_your_private_keys_are_missing_()}</p>
					<p>{m.Before_using_the_app_again_you_need_to_restore_them_()}</p>
=======
					<p>You have been redirected here because your private keys are missing.</p>
					<p>Before using the app again, you need to restore them.</p>
>>>>>>> theirs
				</div>
			</Alert>
		{/if}

		<Hr />

		{#if $currentUser}
<<<<<<< ours
			<P>{m.Please_type_here_your_seed_to_restore_your_keyring_()}</P>
		{:else}
			<P>{m.Please_type_here_your_email_and_your_seed_to_restore_your_keyring_()}</P>
=======
			<P>Please type here your seed to restore your keyring.</P>
		{:else}
			<P>Please type here your email and your seed to restore your keyring.</P>
>>>>>>> theirs
		{/if}

		<Form {superform}>
			{#if !$currentUser}
				<div class="space-y-1">
					<Input {superform} field="email" options={{ label: 'User email' }} />
					<P size="sm" color="text-gray-400">
<<<<<<< ours
						{m.Your_email_wont_be_stored_anywhere_it_will_be_used_only_to_generate_the_keys_()}
=======
						Your email won't be stored anywhere, it will be used only to generate the keys.
>>>>>>> theirs
					</P>
				</div>
			{/if}

			<Textarea {superform} field="seed" options={{ placeholder: textAreaPlaceholder }} />

			<FormError />

			<div class="flex justify-end">
<<<<<<< ours
				<SubmitButton>{m.Regenerate_keys()}</SubmitButton>
=======
				<SubmitButton>Regenerate keys</SubmitButton>
>>>>>>> theirs
			</div>
		</Form>

		<Hr />

<<<<<<< ours
		<A href="/keypairoom" class="text-sm">{m.Forgot_the_seed_Regenerate_it()}</A>
	{:else}
		<div class="space-y-4 p-6 flex flex-col">
			<Heading tag="h4">{m.Keys_regenerated()}</Heading>
			<P>
				{m.Your_keys_have_been_regenerated_You_can_now_go_back_to()}
				<A href="/my">{m.your_profile()}</A>.
=======
		<A href="/keypairoom" class="text-sm">Forgot the seed? Regenerate it</A>
	{:else}
		<div class="space-y-4 p-6 flex flex-col">
			<Heading tag="h4">Keys regenerated!</Heading>
			<P>
				Your keys have been regenerated. You can now go back to
				<A href="/my">your profile</A>.
>>>>>>> theirs
			</P>
		</div>
	{/if}
</Card>
