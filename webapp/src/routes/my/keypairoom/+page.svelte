<script lang="ts">
	import { userQuestions, type UserAnswers } from '$lib/auth/userQuestions';
	import { generateKeypair, getHMAC, saveKeyringToLocalStorage } from '$lib/auth/keypair';
	import { getPublicKeysFromKeypair, updateUserPublicKeys } from '$lib/auth/updateUserPublicKeys';
	import { pb } from '$lib/pocketbase';

	// Components
	import { Alert, Button, Heading, Hr, P } from 'flowbite-svelte';
	import CopyButton from '$lib/components/copyButton.svelte';
	import Form, { createForm } from '$lib/components/forms/form.svelte';
	import Input from '$lib/components/forms/input.svelte';
	import { z } from 'zod';

	//

	export let data;

	let seed = '';

	const schema = (
		z.object({
			question1: z.string(),
			question2: z.string(),
			question3: z.string(),
			question4: z.string(),
			question5: z.string()
		}) satisfies z.ZodType<UserAnswers>
	)
		.partial()
		.refine((v) => {
			return Object.values(v).filter((v) => Boolean(v)).length >= 3;
		}, 'AT_LEAST_THREE_QUESTIONS');

	const superform = createForm(schema, async ({ form }) => {
		const { data: formData } = form;
		const userEmail = data.user?.email as string;
		const userAnswers: UserAnswers = {
			question1: formData.question1!,
			question2: formData.question2!,
			question3: formData.question3!,
			question4: formData.question4!,
			question5: formData.question5!
		};

		const HMAC = await getHMAC(userEmail);
		const keypair = await generateKeypair(userEmail, HMAC, userAnswers);

		saveKeyringToLocalStorage(keypair.keyring);
		seed = keypair.seed;

		const publicKeys = getPublicKeysFromKeypair(keypair);
		await updateUserPublicKeys(data.user?.id!, publicKeys);

		await pb.send('/api/did', {});
	});

	const { capture, restore } = superform;
	export const snapshot = { capture, restore };
</script>

<div
	class=" bg-white mx-auto max-w-md p-6 rounded-md shadow-md dark:bg-gray-800 dark:text-white space-y-6"
>
	{#if !seed}
		<Form {superform} className="space-y-6">
			<h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Generate your keys</h3>

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
						By answering these questions, you will generate keys that will be used to encrypt your
						data.
					</li>
					<li>Please remember the answers, as they will be the only way to restore the keys.</li>
					<li>Please answer at least 3 of the following questions.</li>
				</ul>
			</Alert>

			{#each userQuestions as question}
				<Input field={question.id} label={question.text} />
			{/each}

			<Hr />
		</Form>
	{:else}
		<Heading tag="h4">Keypair creation successful!</Heading>
		<P size="sm" color="text-gray-400 dark:text-gray-600">
			Please store this in a safe place to recover your account in the future, this passphrase will
			be shown only one time!
		</P>
		<Alert dismissable={false} accent={false}>
			<span class="font-mono">
				{seed}
				<div class="flex flex-col items-end pt-4">
					<CopyButton textToCopy={seed}>Copy seed</CopyButton>
				</div>
			</span>
		</Alert>
		<Button href="/my/dashboard">Go to Dashboard</Button>
	{/if}
</div>
