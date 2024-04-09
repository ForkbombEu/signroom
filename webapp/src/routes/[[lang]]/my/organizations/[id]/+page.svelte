<script lang="ts">
	import { page } from '$app/stores';
	import { A, P, Button } from 'flowbite-svelte';
	import { OrgRoles, ProtectedOrgUI } from '$lib/rbac/index.js';
	import { m } from '$lib/i18n';

	import OrganizationLayout from '$lib/components/organizationLayout.svelte';
	import PageCard from '$lib/components/pageCard.svelte';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import { ArrowRight } from 'svelte-heros-v2';

	export let data;
	let { organization, services, requests } = data;

	const { OWNER, ADMIN } = OrgRoles;

	$: issuancesInView = services.slice(0, 4);
	$: flowsCount = issuancesInView.length;
	$: requestsCount = requests.length;

	$: base = (path: string) => `${$page.url.pathname}${path}`;
</script>

<OrganizationLayout org={data.organization}>
	<div class="flex gap-4">
		<PageCard class="grow">
			<SectionTitle tag="h5" title={m.Issuance_flows()} description={m.issuance_flows_description()}
			></SectionTitle>

			<div class="flex flex-col gap-2 justify-center items-center mt-8 border rounded-lg h-60">
				<P class="font-semibold text-primary-700">
					{flowsCount}
					{flowsCount == 1 ? m.active_flow() : m.active_flows()}
				</P>
				<Button outline href={base('/credential-issuances')}>
					<ArrowRight class="mr-2" size="20" />
					{m.Manage()}
				</Button>
			</div>
		</PageCard>

		<ProtectedOrgUI orgId={organization.id} roles={[ADMIN, OWNER]}>
			<PageCard class="grow">
				<SectionTitle
					tag="h5"
					title={m.Membership_requests()}
					description={m.pending_membership_requests_description()}
				/>

				<div class="flex flex-col gap-2 justify-center items-center mt-8 border rounded-lg h-60">
					<P class="font-semibold text-primary-700">
						{requestsCount}
						{requestsCount == 1 ? m.new_membership_request() : m.new_membership_requests()}</P
					>
					<Button outline href={base('/members')}>
						<ArrowRight class="mr-2" size="20" />
						{m.Manage()}
					</Button>
				</div>
			</PageCard>
		</ProtectedOrgUI>
	</div>
</OrganizationLayout>
