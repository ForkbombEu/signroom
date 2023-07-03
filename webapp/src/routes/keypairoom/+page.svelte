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
	import { areFeaturesActive, features, featuresNames, isFeatureActive } from '$lib/features';

	// Components
	import { Alert, Button, Heading, Hr, P } from 'flowbite-svelte';
	import CopyButton from '$lib/components/copyButton.svelte';
	import Form, { createForm } from '$lib/components/forms/form.svelte';
	import Input from '$lib/components/forms/input.svelte';

	//

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

		if (isFeatureActive($features, featuresNames.AUTH) && $currentUser) {
			const publicKeys = getPublicKeysFromKeypair(keypair);
			await updateUserPublicKeys($currentUser?.id!, publicKeys);
		}

		if (areFeaturesActive($features, [featuresNames.DID, featuresNames.AUTH]) && $currentUser) {
			await pb.send('/api/did', {});
		}
	});

	const { capture, restore, form } = superform;
	export const snapshot = { capture, restore };

	if ($currentUser) $form.email = $currentUser.email;
</script>

{#if !seed}
	<Heading tag="h4">Generate your keys</Heading>

	<Alert dismissable={false} accent={false}>
		<span slot="icon"
			><svg
				aria-hidden="true"
				class="w-5 h-5"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				><path
					fill-rule="evenodd"
					d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
					clip-rule="evenodd"
				/></svg
			>
		</span>
		<span class="sr-only">Info</span>
		<span class="font-bold">Important information</span>
		<ul slot="extra" class="mt-0 ml-8 list-disc pl-4 space-y-1 pt-1">
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
	</Form>
{:else}
	<Heading tag="h4">Keypair creation successful!</Heading>
	<P size="sm" color="text-gray-400 dark:text-gray-600">
		Please store this in a safe place to recover your account in the future, this passphrase will be
		shown only one time!
	</P>
	<Alert dismissable={false} accent={false}>
		<span class="font-mono">
			{seed}
			<div class="flex flex-col items-end pt-4">
				<CopyButton textToCopy={seed}>Copy seed</CopyButton>
			</div>
		</span>
	</Alert>
	<Button href="/my">Go to Dashboard</Button>
{/if}
