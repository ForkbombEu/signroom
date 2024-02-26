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
	import { welcomeSearchParamKey } from '$lib/utils/constants.js';
	import { appTitle } from '$lib/strings.js';
	import { page } from '$app/stores';
	import { goto, m } from '$lib/i18n';

	// Components
	import { A, Alert, Button, Heading, Hr, P } from 'flowbite-svelte';
	import CopyButton from '$lib/components/copyButton.svelte';
	import { Form, createForm, Input, FormError, SubmitButton } from '$lib/forms';
	import { InformationCircle } from 'svelte-heros-v2';
	import Card from '$lib/components/card.svelte';

	const url = $page.url;

	const joined = url.searchParams.get('joined');

	//

	let seed = '';

	const schema = z.object({
		email: z.string().email(),
		questions: userAnswersSchema
	});

	const superform = createForm(schema, async ({ form }) => {
		let { data } = form;
		let { email } = form.data;

		const HMAC = await getHMAC(email);

		const keypair = await generateKeypair(email, HMAC, formQuestionsToUserAnswers(data.questions));
		saveKeyringToLocalStorage(keypair.keyring);
		seed = keypair.seed;

		if ($featureFlags.AUTH && $currentUser) {
			const publicKeys = getPublicKeysFromKeypair(keypair);
			await updateUserPublicKeys($currentUser?.id!, publicKeys);
		}

		if ($featureFlags.DID && $featureFlags.AUTH && $currentUser) {
			await pb.send('/api/did', {});
		}
		if (joined) {
			await goto('my/organizations');
		}
	});

	// non-answered questions *must* be set to 'null'
	function formQuestionsToUserAnswers(questions: z.infer<typeof schema>['questions']): UserAnswers {
		return {
			question1: questions['question1'] ?? 'null',
			question2: questions['question2'] ?? 'null',
			question3: questions['question3'] ?? 'null',
			question4: questions['question4'] ?? 'null',
			question5: questions['question5'] ?? 'null'
		};
	}

	const { capture, restore, form } = superform;
	export const snapshot = { capture, restore };

	if ($currentUser) $form.email = $currentUser.email;

	//

	$: isWelcome = $page.url.searchParams.has(welcomeSearchParamKey);
	$: searchParams = $page.url.searchParams.toString();
</script>

{#if isWelcome}
	<div class="-rotate-1 mb-6">
		<Alert color="yellow" border>
			<div class="text-ellipsis overflow-hidden space-y-3">
				<Heading color="yellow" tag="h2" class="text-ellipsis">{m.Welcome_to()} {appTitle} 🎉</Heading>
				<P color="yellow" weight="bold">{m.Thanks_for_joining_us()}</P>
				<P color="yellow">
					{m.One_last_thing_before_to_using_the_app()}<br /> {m.we_need_you_to_answer_these_questions_as_they_will_be_used_to_secure_your_data_()}
				</P>
			</div>
		</Alert>
	</div>
{/if}

<Card class="p-6 space-y-6">
	{#if !seed}
		<Heading tag="h4">{m.Generate_your_keys()}</Heading>

		<Alert color="blue">
			<span class="sr-only">{m.Info()}</span>
			<span class="font-bold text flex items-center mb-2">
				<div class="mr-1">
					<InformationCircle size="20" />
				</div>
				{m.Important_information()}
			</span>
			<ul class="list-disc pl-4 space-y-1 pt-1">
				<li>
					{m.By_answering_these_questions_you_will_generate_keys_that_will_be_used_to_encrypt_your_data()}
				</li>
				<li>
					{m.Please_remember_the_answers_as_they_will_be_the_only_way_to_restore_the_encryption_keys()}
				</li>
				<li>{m.Please_answer_at_least_3_of_the_following_questions()}</li>
			</ul>
		</Alert>

		<Hr />

		<Form {superform} className="space-y-6">
			{#if !$currentUser}
				<div class="space-y-1">
					<Input {superform} field="email" options={{ label: m.User_email() }} />

					<P size="sm" color="text-gray-400">
						{m.Your_email_wont_be_stored_anywhere_it_will_be_used_only_to_generate_the_keys_()}
					</P>
				</div>

				<Hr />
			{/if}

			{#each userQuestions as question}
				<Input {superform} field={`questions.${question.id}`} options={{ label: question.text }} />
			{/each}

			<FormError />

			<div class="flex justify-end">
				<SubmitButton>{m.Generate_keys()}</SubmitButton>
			</div>
		</Form>

		<Hr />

		<A class="text-sm" href="/keypairoom/regenerate">{m.I_have_the_seed_passphrase()}</A>
	{:else}
		<Heading tag="h4">{m.Keypair_creation_successful()}</Heading>
		<P size="sm" color="text-gray-400 dark:text-gray-600">
			{m.Please_store_this_in_a_safe_place_to_recover_your_account_in_the_future_this_passphrase_will_be_shown_only_one_time()}
		</P>
		<Alert color="blue">
			<span class="font-mono">
				{seed}
				<div class="flex flex-col items-end pt-4">
					<CopyButton textToCopy={seed}>{m.Copy_seed()}</CopyButton>
				</div>
			</span>
		</Alert>
		<Button href={`/my?${searchParams}`}>{m.Go_to_Dashboard()}</Button>
	{/if}
</Card>
