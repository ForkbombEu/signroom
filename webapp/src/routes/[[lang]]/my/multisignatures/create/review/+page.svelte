<script lang="ts">
	import {
		multisignatureFormDataSchema,
		multisignatureFormData,
		createMultisignatureAndSeals
	} from '../logic';
	import { Form, createForm, SubmitButton, FormError } from '$lib/forms';
	import { currentUser, pb } from '$lib/pocketbase';

	import { assets } from '$app/paths';
	import SideCard from '$lib/components/sideCard.svelte';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import { Button } from 'flowbite-svelte';
	import { ArrowRight, ArrowLeft } from 'svelte-heros-v2';
	import { Collections, type UsersResponse } from '$lib/pocketbase/types';
	import ReviewField from '$lib/components/reviewField.svelte';
	import PageTop from '$lib/components/pageTop.svelte';
	import PageContent from '$lib/components/pageContent.svelte';
	import PageCard from '$lib/components/pageCard.svelte';

	//

	$multisignatureFormData.owner = $currentUser!.id;

	const superform = createForm(
		multisignatureFormDataSchema,
		({ form }) => createMultisignatureAndSeals(form.data),
		$multisignatureFormData,
		{ validationMethod: 'onblur' }
	);

	function getOwner() {
		return pb.collection(Collections.Users).getOne<UsersResponse>($currentUser!.id);
	}

	function getParticipants() {
		const filter = $multisignatureFormData.participants.map((id) => `id = "${id}"`).join(' || ');
		return pb.collection(Collections.Users).getFullList<UsersResponse>({ filter });
	}
</script>

<PageTop>
	<SectionTitle
		title="Review multisignature"
		description="Review the content of the multisignature before confirming."
	/>
</PageTop>

<PageContent class="flex !space-y-0 items-start gap-8">
	<PageCard class="p-6 space-y-6 grow">
		<SectionTitle tag="h5" title="Multisignature details" />

		<ReviewField label="Signature name">
			<p>{$multisignatureFormData.name}</p>
		</ReviewField>

		<ReviewField label="Organizer">
			{#await getOwner() then owner}
				<p>{owner.username}</p>
			{/await}
		</ReviewField>

		<ReviewField label="Participants">
			{#await getParticipants() then participants}
				<p>(You)</p>
				{#each participants as p}
					<p>{p.username}</p>
				{/each}
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
