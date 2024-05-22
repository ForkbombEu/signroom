<script lang="ts">
	import {
		multisignatureFormDataSchema,
		multisignatureFormData,
		createMultisignatureAndSeals,
		resetMultisignatureFormData,
		createReflowSeal,
		getParticipantsReflowPublicKeys
	} from '../logic';
	import { Form, createForm, SubmitButton, FormError } from '$lib/forms';
	import { currentUser, pb } from '$lib/pocketbase';

	import { assets } from '$app/paths';
	import SideCard from '$lib/components/sideCard.svelte';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import { Button } from 'flowbite-svelte';
	import { ArrowRight, ArrowLeft } from 'svelte-heros-v2';
	import {
		Collections,
		type CoconutCredentialIssuersResponse,
		type UsersResponse
	} from '$lib/pocketbase/types';
	import ReviewField from '$lib/components/reviewField.svelte';
	import PageTop from '$lib/components/pageTop.svelte';
	import PageContent from '$lib/components/pageContent.svelte';
	import PageCard from '$lib/components/pageCard.svelte';
	import { goto } from '$lib/i18n';

	//

	$: addCurrentUserAsOwner($currentUser);

	const superform = createForm(
		multisignatureFormDataSchema,
		async ({ form }) => {
			const { data } = form;
			const public_keys = await getParticipantsReflowPublicKeys(data.participants);
			const reflow_seal = await createReflowSeal(JSON.parse(data.contentJSON), public_keys);
			const multisignature = await createMultisignatureAndSeals({
				...data,
				reflow_seal,
				owner: $currentUser?.id!
			});
			resetMultisignatureFormData();
			await goto(`/my/multisignatures/${multisignature.id}`);
		},
		$multisignatureFormData
	);

	// Data operations

	function addCurrentUserAsOwner(user: typeof $currentUser) {
		$multisignatureFormData.owner = user?.id ?? '';
	}

	// Display operations

	function getOwner() {
		return pb.collection(Collections.Users).getOne<UsersResponse>($currentUser!.id);
	}

	function getParticipants() {
		const filter = $multisignatureFormData.participants.map((id) => `id = "${id}"`).join(' || ');
		return pb.collection(Collections.Users).getFullList<UsersResponse>({ filter });
	}

	function getIssuer() {
		return pb
			.collection(Collections.CoconutCredentialIssuers)
			.getOne<CoconutCredentialIssuersResponse>($multisignatureFormData.credentialIssuer);
	}
</script>

<PageTop>
	<SectionTitle
		title="Review multisignature"
		description="Review the content of the multisignature before confirming."
	/>
</PageTop>

<PageContent layout="horizontal">
	<PageCard class="p-6 space-y-5 grow">
		<SectionTitle tag="h5" title="Multisignature details" />

		<ReviewField label="Signature name">
			<p>{$multisignatureFormData.name}</p>
		</ReviewField>

		<ReviewField label="Organizer">
			{#await getOwner() then owner}
				<p>{owner.name}</p>
			{/await}
		</ReviewField>

		<ReviewField label="Participants">
			{#await getParticipants() then participants}
				{#each participants as p}
					<p>{p.name}</p>
				{/each}
			{/await}
		</ReviewField>

		<ReviewField label="Credential issuer">
			{#await getIssuer() then issuer}
				<p>{issuer.name} – {issuer.endpoint}</p>
			{/await}
		</ReviewField>

		<ReviewField label="Content">
			{$multisignatureFormData.contentJSON}
		</ReviewField>

		<ReviewField label="Deadline for signature">
			{$multisignatureFormData.sealExpirationDate}
		</ReviewField>
	</PageCard>

	<SideCard title="Review and sign" image={`${assets}/multisignatures/multisignature-step-3.svg`}>
		<svelte:fragment slot="top">
			<SectionTitle title="Step 3 of 3" tag="h6" />
		</svelte:fragment>
		<svelte:fragment slot="bottom">
			<Form {superform}>
				<FormError />
				<div class="flex justify-stretch gap-2">
					<Button
						color="alternative"
						class="p-0 grow"
						href="/my/multisignatures/create/participants"
					>
						<ArrowLeft />
					</Button>
					<SubmitButton>
						<span class="mr-2 text-nowrap">Confirm and Sign</span><ArrowRight />
					</SubmitButton>
				</div>
			</Form>
		</svelte:fragment>
	</SideCard>
</PageContent>
