<script>
	import { assets } from '$app/paths';
	import Card from '$lib/components/card.svelte';
	import QuickAction from '$lib/components/quickAction.svelte';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import { Button, Heading } from 'flowbite-svelte';
	import { ArrowRight } from 'svelte-heros-v2';
	import SideCard from '$lib/components/sideCard.svelte';
</script>

<div class="flex items-start gap-8">
	<div class="space-y-8">
		<div class="p-6">
			<SectionTitle title="Create multisignature">
				<p class="text-gray-500" slot="description">
					The Reflow multisignature employs homomorphic cryptography, allowing invited participants
					to cryptographically sign a data object. Our cryptographic flow prioritizes
					privacy-by-design and GDPR compliance.
				</p>
			</SectionTitle>
		</div>

		<Card class="p-6 space-y-8">
			<SectionTitle
				tag="h5"
				title="Requirements for Multisignature"
				description="Before proceeding, ensure you have the following:"
			/>

			<div class="space-y-4">
				<QuickAction
					title="Coconut Issuer"
					content="An entity responsible for issuing Coconut credentials is required for multi-signature."
				/>
				<!-- <QuickAction
					title="Croupier"
					content="The Croupier aggregates signatures from participants during the multi-signature process."
				/> -->
				<QuickAction
					title="Participant Account and DID"
					content="Users must have already an account and DID on the platform to be invited to sign."
				/>
			</div>
		</Card>
	</div>

	<SideCard
		title="Multisignature setup"
		description="Successful completion of the multisignature process requires signatures from all participants"
		image={`${assets}/multisignatures/multisignature-step-1.svg`}
	>
		<svelte:fragment slot="bottom">
			<Button href="/my/multisignatures/create/setup">
				<span class="mr-2">Start setup</span><ArrowRight />
			</Button>
		</svelte:fragment>
	</SideCard>
</div>
