<script lang="ts">
	import {
		multisignatureFormDataSchema,
		multisignatureFormData,
		createMultisignatureAndSeals
	} from '../logic';
	import { goto } from '$lib/i18n';
	import { Form, createForm, SubmitButton, FormError } from '$lib/forms';
	import { currentUser, pb } from '$lib/pocketbase';

	import { assets } from '$app/paths';
	import Card from '$lib/components/card.svelte';
	import SideCard from '$lib/components/sideCard.svelte';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import { Button } from 'flowbite-svelte';
	import { ArrowRight, ArrowLeft } from 'svelte-heros-v2';
	import { Collections, type UsersResponse } from '$lib/pocketbase/types';
	import ReviewField from '$lib/components/reviewField.svelte';

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

<Form {superform}>
	<div class="flex items-start gap-8">
		<div class="space-y-8 grow">
			<div class="p-6 pb-0">
				<SectionTitle
					title="Review multisignature"
					description="Review the content of the multisignature before confirming."
				/>
			</div>

			<Card class="p-6 space-y-6">
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
			</Card>
		</div>

		<SideCard title="Review and sign" image={`${assets}/multisignatures/multisignature-step-3.svg`}>
			<svelte:fragment slot="top">
				<SectionTitle title="Step 3 of 3" tag="h6" />
			</svelte:fragment>
			<svelte:fragment slot="bottom">
				<FormError />
				<div class="flex justify-stretch gap-2">
					<Button
						color="alternative"
						class="p-0 grow"
						href="/my/multisignatures/create/participants"
					>
						<ArrowLeft />
					</Button>
					<SubmitButton class="px-4">
						<span class="mr-2 text-nowrap">Confirm and Sign</span><ArrowRight />
					</SubmitButton>
				</div>
			</svelte:fragment>
		</SideCard>
	</div>
</Form>
