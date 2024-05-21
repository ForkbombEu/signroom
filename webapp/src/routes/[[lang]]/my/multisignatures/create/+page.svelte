<script>
	import { assets } from '$app/paths';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import { Button } from 'flowbite-svelte';
	import { ArrowRight } from 'svelte-heros-v2';
	import SideCard from '$lib/components/sideCard.svelte';
	import PageTop from '$lib/components/pageTop.svelte';
	import { m } from '$lib/i18n';
	import PageContent from '$lib/components/pageContent.svelte';
	import PageCard from '$lib/components/pageCard.svelte';
	import PlainCard from '$lib/components/plainCard.svelte';
</script>

<PageTop>
	<SectionTitle
		title={m.Create_a_new_multisignature()}
		description={m.create_a_new_multisignature_description()}
	/>
</PageTop>

<PageContent layout="horizontal">
	<PageCard class="grow">
		<SectionTitle
			tag="h5"
			title={m.Requirements_for_multisignature_creation()}
			description={m.Before_proceeding_ensure_you_have_the_following_()}
		/>

		<div class="space-y-4">
			<PlainCard let:Title let:Description>
				<Title>{m.Coconut_issuer()}</Title>
				<Description>{m.coconut_issuer_description()}</Description>
			</PlainCard>

			<PlainCard let:Title let:Description>
				<Title>{m.Participant_account_and_did()}</Title>
				<Description>{m.participant_account_and_did_description()}</Description>
			</PlainCard>
		</div>
	</PageCard>

	<SideCard
		title={m.Multisignature_setup()}
		description={m.multisignature_setup_description()}
		image={`${assets}/multisignatures/multisignature-step-1.svg`}
	>
		<svelte:fragment slot="bottom">
			<Button href="/my/multisignatures/create/setup">
				<span class="mr-2">Start setup</span><ArrowRight />
			</Button>
		</svelte:fragment>
	</SideCard>
</PageContent>
