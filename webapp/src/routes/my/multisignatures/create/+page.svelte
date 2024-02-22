<script>
	import { assets } from '$app/paths';
	import Card from '$lib/components/card.svelte';
	import QuickAction from '$lib/components/quickAction.svelte';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import { Button, Heading, Hr } from 'flowbite-svelte';
	import { ArrowRight } from 'svelte-heros-v2';
</script>

<div class="flex items-start gap-8">
	<div class="space-y-8">
		<div class="p-6">
			<SectionTitle title="Create multisignature">
				The Reflow multisignature employs homomorphic cryptography, allowing invited participants to
				cryptographically sign a data object. Our cryptographic flow prioritizes privacy-by-design
				and GDPR compliance.
			</SectionTitle>
		</div>

		<Card class="p-6 space-y-8">
			<SectionTitle title="Requirements for Multisignature" tag="h5">
				Before proceeding, ensure you have the following:
			</SectionTitle>

			<div class="space-y-4">
				<QuickAction
					title="Coconut Issuer"
					content="An entity responsible for issuing Coconut credentials is required for multi-signature."
				/>
				<QuickAction
					title="Croupier"
					content="The Croupier aggregates signatures from participants during the multi-signature process."
				/>
				<QuickAction
					title="Participant Account and DID"
					content="Users must have already an account and DID on the platform to be invited to sign."
				/>
			</div>
		</Card>
	</div>

	<Card class="p-6 w-[300px] shrink-0 space-y-8">
		<img
			class="border rounded-xl overflow-hidden bg-gray-100"
			src={`${assets}/multisignatures/multisignature-step-1.svg`}
			alt=""
		/>
		<div class="space-y-2">
			<Heading tag="h6">Multisignature setup</Heading>
			<p>
				Successful completion of the multisignature process requires signatures from all
				participants
			</p>
		</div>
		<Button><span class="mr-2">Start setup</span><ArrowRight /></Button>
	</Card>
</div>
