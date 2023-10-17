<script lang="ts">
	import {
		userQuestions,
		type UserAnswers,
		userAnswersSchema
	} from '$lib/keypairoom/userQuestions.js';
	import { generateKeypair, getHMAC, saveKeyringToLocalStorage } from '$lib/keypairoom/keypair';
	import {
		getPublicKeysFromKeypair,
		updateUserPublicKeys
	} from '$lib/keypairoom/updateUserPublicKeys';
	import { currentUser, pb } from '$lib/pocketbase';
	import { z } from 'zod';
	import { featureFlags } from '$lib/features';

	// Components
	import { Alert, Button, Heading, Hr, P } from 'flowbite-svelte';
	import CopyButton from '$lib/components/copyButton.svelte';
	import { Form, createForm, Input, FormError, SubmitButton } from '$lib/forms';
	import { InformationCircle } from 'svelte-heros-v2';
	import { generateKeyAndCertificate } from '$lib/keypairoom/x509';

	let seed = '';

	const schema = z.object({
		email: z.string().email(),
		questions: userAnswersSchema
	});

	const superform = createForm(schema, async ({ form }) => {
		let { data } = form;
		let { email } = data;

		const HMAC = await getHMAC(email);

		// non-answered questions *must* be set to null
		for (let [key, value] of Object.entries(data.questions)) {
			if (!value) data.questions[key] = 'null';
		}

		const keypair = await generateKeypair(email, HMAC, data.questions);
		saveKeyringToLocalStorage(keypair.keyring);
		seed = keypair.seed;

		await generateKeyAndCertificate();

		if ($featureFlags.AUTH && $currentUser) {
			const publicKeys = getPublicKeysFromKeypair(keypair);
			await updateUserPublicKeys($currentUser?.id!, publicKeys);
		}

		if ($featureFlags.DID && $featureFlags.AUTH && $currentUser) {
			await pb.send('/api/did', {});
		}
	});

	const { capture, restore, form } = superform;
	export const snapshot = { capture, restore };

	if ($currentUser) $form.email = $currentUser.email;
</script>

{#if !seed}
	<Heading tag="h4">Generate your keys</Heading>

	<Alert color="blue">
		<svelte:fragment slot="icon">
			<InformationCircle />
		</svelte:fragment>
		<span class="sr-only">Info</span>
		<span class="font-bold">Important information</span>
		<ul class="list-disc pl-4 space-y-1 pt-1">
			<li>
				By answering these questions, you will generate keys that will be used to encrypt your data.
			</li>
			<li>Please remember the answers, as they will be the only way to restore the keys.</li>
			<li>Please answer at least 3 of the following questions.</li>
		</ul>
	</Alert>

	<Form {superform} className="space-y-6">
		{#if !$currentUser}
			<div class="space-y-1">
				<Input field="email" label="User email" />
				<P size="sm" color="text-gray-400">
					Your email won't be stored anywhere, it will be used only to generate the keys.
				</P>
			</div>
			<Hr />
		{/if}
		{#each userQuestions as question}
			<Input field={`questions.${question.id}`} label={question.text} />
		{/each}

		<Hr />

		<FormError />
		<div class="flex justify-end">
			<SubmitButton>Generate keys</SubmitButton>
		</div>
	</Form>
{:else}
	<Heading tag="h4">Keypair creation successful!</Heading>
	<P size="sm" color="text-gray-400 dark:text-gray-600">
		Please store this in a safe place to recover your account in the future, this passphrase will be
		shown only one time!
	</P>
	<Alert color="blue">
		<span class="font-mono">
			{seed}
			<div class="flex flex-col items-end pt-4">
				<CopyButton textToCopy={seed}>Copy seed</CopyButton>
			</div>
		</span>
	</Alert>
	<Button href="/my">Go to Dashboard</Button>
{/if}
