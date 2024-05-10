<script lang="ts">
	import { multisignatureFormData, participantsSchema } from '../logic';
	import { Collections, type UsersResponse } from '$lib/pocketbase/types';
	import { currentUser } from '$lib/pocketbase';
	import { goto } from '$lib/i18n';

	import { Form, createForm, SubmitButton, FormError, Relations } from '$lib/forms';

	import { assets } from '$app/paths';
	import { createTypeProp } from '$lib/utils/typeProp';
	import Card from '$lib/components/card.svelte';
	import SideCard from '$lib/components/sideCard.svelte';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import { Button } from 'flowbite-svelte';
	import { ArrowRight, ArrowLeft } from 'svelte-heros-v2';
	import PageTop from '$lib/components/pageTop.svelte';
	import PageContent from '$lib/components/pageContent.svelte';

	//

	const superform = createForm(
		participantsSchema,
		async ({ form }) => {
			multisignatureFormData.update((data) => ({ ...data, ...form.data }));
			await goto('/my/multisignatures/create/review');
		},
		$multisignatureFormData
	);

	const recordType = createTypeProp<UsersResponse>();
</script>

<Form {superform} className="space-y-0">
	<PageTop>
		<SectionTitle
			title="Invite Participants to Sign"
			description="Successful completion of the multi-signature process necessitates signatures from all participants."
		/>
	</PageTop>

	<PageContent layout="horizontal">
		<Card class="p-6 space-y-8 grow">
			<SectionTitle tag="h5" title="Search Participants" />
			<Relations
				{superform}
				{recordType}
				collection={Collections.Users}
				field="participants"
				options={{
					label: 'Search users',
					placeholder: 'Search participants by full name',
					multiple: true,
					displayFields: ['username']
				}}
			/>
		</Card>

		<SideCard
			title="Invite participants to sign"
			description="Invite others within your organization to participate to the multi-signature process."
			image={`${assets}/multisignatures/multisignature-step-2.svg`}
		>
			<svelte:fragment slot="top">
				<SectionTitle title="Step 2 of 3" tag="h6" />
			</svelte:fragment>
			<svelte:fragment slot="bottom">
				<FormError />
				<div class="flex justify-stretch gap-2">
					<Button color="alternative" class="p-0 grow" href="/my/multisignatures/create/setup">
						<ArrowLeft />
					</Button>
					<SubmitButton>
						<span class="mr-2 text-nowrap">Confirm participants</span><ArrowRight />
					</SubmitButton>
				</div>
			</svelte:fragment>
		</SideCard>
	</PageContent>
</Form>
