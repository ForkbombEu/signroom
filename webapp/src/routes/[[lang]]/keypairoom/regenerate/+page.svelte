<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import {
		getHMAC,
		matchPublicAndPrivateKeys,
		regenerateKeypair,
		saveKeyringToLocalStorage,
		type Keyring
	} from '$lib/keypairoom/keypair';
	import { currentUser, pb } from '$lib/pocketbase';

	import { z } from 'zod';
	import { Form, createForm, FormError, SubmitButton, Textarea, Input } from '$lib/forms';
	import { A, Heading, Hr, P } from 'flowbite-svelte';
	import Card from '$lib/components/card.svelte';
	import { featureFlags } from '$lib/features';
	import { getUserPublicKeys, RegenerateKeyringSession } from '$lib/keypairoom/utils';
	import { m } from '$lib/i18n';
	import RegenerateBanner from '../_partials/RegenerateBanner.svelte';
	import { log } from '$lib/utils/devLog';

	//

	let success = false;

	const schema = z.object({
		email: z.string().email(),
		seed: z.string()
	});

	const superform = createForm(schema, async ({ form }) => {
		const hmac = await getHMAC(form.data.email);

		let keyring: Keyring;
		try {
			const keypair = await regenerateKeypair(form.data.seed, hmac);
			keyring = keypair.keyring;
		} catch (e) {
			throw new Error(m.Invalid_seed());
		}

		if ($featureFlags.AUTH && $currentUser) {
			const publicKeys = await getUserPublicKeys();
			if (!publicKeys) {
				throw new Error(
					m.User_public_keys_are_missing_Please_generate_them_using_the_security_questions_()
				);
			} else {
				try {
					await matchPublicAndPrivateKeys(publicKeys, keyring);
				} catch (e) {
					throw new Error(m.Invalid_seed());
				}
			}

			if ($featureFlags.DID) {
				try {
					await pb.send('/api/did', {});
				} catch (e) {
					log(e);
				}
			}
		}

		saveKeyringToLocalStorage(keyring);
		success = true;

		if (RegenerateKeyringSession.isActive()) RegenerateKeyringSession.end();
	});

	const { form } = superform;
	if ($currentUser) $form.email = $currentUser.email;

	const textAreaPlaceholder =
		'skin buyer sunset person run push elevator under debris soft surge man';
</script>

<Card class="space-y-6 p-6">
	{#if !success}
		<Heading tag="h4">{m.Regenerate_keys()}</Heading>

		{#if RegenerateKeyringSession.isActive()}
			<RegenerateBanner />
		{/if}

		{#if $currentUser}
			<P>{m.Please_type_here_your_seed_to_restore_your_keyring_()}</P>
		{:else}
			<P>{m.Please_type_here_your_email_and_your_seed_to_restore_your_keyring_()}</P>
		{/if}

		<Form {superform}>
			{#if !$currentUser}
				<div class="space-y-1">
					<Input {superform} field="email" options={{ label: m.User_email() }} />
					<P size="sm" color="text-gray-400">
						{m.Your_email_wont_be_stored_anywhere_it_will_be_used_only_to_generate_the_keys_()}
					</P>
				</div>
			{/if}

			<Textarea {superform} field="seed" options={{ placeholder: textAreaPlaceholder }} />

			<FormError />

			<div class="flex justify-end">
				<SubmitButton>{m.Regenerate_keys()}</SubmitButton>
			</div>
		</Form>

		<Hr />

		<A href="/keypairoom" class="text-sm">{m.Forgot_the_seed_Regenerate_it()}</A>
	{:else}
		<div class="flex flex-col space-y-4 p-6">
			<Heading tag="h4">{m.Keys_regenerated()}</Heading>
			<P>
				{m.Your_keys_have_been_regenerated_You_can_now_go_back_to()}
				<A href="/my">{m.your_profile()}</A>.
			</P>
		</div>
	{/if}
</Card>
