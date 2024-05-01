<script lang="ts">
<<<<<<< ours
	import { page } from '$app/stores';
	import { ProtectedOrgUI } from '$lib/rbac/index.js';
	import { m } from '$lib/i18n';

	import OrganizationLayout from '$lib/components/organizationLayout.svelte';
	import PageCard from '$lib/components/pageCard.svelte';
	import HomeSection from './_partials/homeSection.svelte';
	import { Badge } from 'flowbite-svelte';
	import { templatesColors } from '$lib/utils/colors';

	export let data;
	let {
		organization,
		membershipRequests,
		microservices,
		issuanceFlows,
		verificationFlows,
		templates
	} = data;

	$: base = (path: string) => `${$page.url.pathname}${path}`;
</script>

<OrganizationLayout org={data.organization}>
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
		<PageCard class="!space-y-4">
			<HomeSection
				title={m.Issuance_flows()}
				items={issuanceFlows}
				singleItemText={m.one_active_flow}
				multipleItemsText={m.num_active_flows}
				noItemsText={m.no_active_flows}
				buttonHref={base('/credential-issuances')}
				let:item
			>
				{item.display_name}
			</HomeSection>
		</PageCard>

		<PageCard class="!space-y-4">
			<HomeSection
				title={m.Verification_flows()}
				items={verificationFlows}
				singleItemText={m.one_active_flow}
				multipleItemsText={m.num_active_flows}
				noItemsText={m.no_active_flows}
				buttonHref={base('/verification-flows')}
				let:item
			>
				{item.name}
			</HomeSection>
		</PageCard>

		<PageCard class="!space-y-4">
			<HomeSection
				title={m.Microservices()}
				items={microservices}
				singleItemText={m.one_microservice}
				multipleItemsText={m.num_microservices}
				noItemsText={m.no_microservices}
				buttonHref={base('/microservices')}
				let:item
			>
				{item.name}
			</HomeSection>
		</PageCard>

		<ProtectedOrgUI orgId={organization.id} roles={['admin', 'owner']}>
			<PageCard class="!space-y-4">
				<HomeSection
					title={m.Templates()}
					items={templates}
					singleItemText={m.one_template}
					multipleItemsText={m.num_templates}
					noItemsText={m.no_templates}
					buttonHref={base('/templates')}
					let:item
				>
					{item.name}
					<Badge class="ml-1" color={templatesColors[item.type]}>
						{item.type}
					</Badge>
				</HomeSection>
			</PageCard>

			<PageCard class="!space-y-4">
				<HomeSection
					title={m.Membership_requests()}
					items={membershipRequests}
					singleItemText={m.one_membership_request}
					multipleItemsText={m.num_membership_requests}
					noItemsText={m.no_membership_requests}
					buttonHref={base('/members')}
					let:item
				>
					{item.user}
				</HomeSection>
			</PageCard>
		</ProtectedOrgUI>
	</div>
</OrganizationLayout>
=======
	import { Button, Heading } from 'flowbite-svelte';

	export let data;
	const { organization } = data;
</script>

<pre>{JSON.stringify(organization, null, 2)}</pre>
>>>>>>> theirs
