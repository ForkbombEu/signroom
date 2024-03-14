<script lang="ts">
	import { page } from '$app/stores';
	import { A, Heading, Hr, P, List, Li } from 'flowbite-svelte';
	import VanityMetric from '$lib/components/vanityMetric.svelte';
	import { OrgRoles, ProtectedOrgUI } from '$lib/rbac/index.js';
	import { m } from '$lib/i18n';

	export let data;
	let { organization, services, requests } = data;
	const { OWNER, ADMIN } = OrgRoles;

	$: issuancesInView = services.slice(0, 4);
</script>

<Heading tag="h3">{organization.name}</Heading>

<Hr />

<div class="flex justify-between">
	<div class="flex space-x-8">
		<VanityMetric number={services.length} text={m.active_credential_issuances()} />

		{#if issuancesInView.length}
			<div>
				<P>{m.Latest_credential_issuances()}</P>
				{#if issuancesInView.length}
					<List>
						{#each issuancesInView as issuance}
							<Li>
								<A href={`${$page.url.pathname}/credential-issuances/${issuance.id}`}>
									{issuance.name}
								</A>
							</Li>
						{/each}
					</List>
				{/if}
			</div>
		{/if}
	</div>

	<div>
		<A href={`${$page.url.pathname}/credential-issuances`}>→ {m.View_all_credential_issuances()}</A>
	</div>
</div>

<ProtectedOrgUI orgId={organization.id} roles={[ADMIN, OWNER]}>
	<Hr />

	<div class="flex justify-between items-start">
		<VanityMetric number={requests.length} text={m.Membership_requests()} />
		<A href={`${$page.url.pathname}/membership-requests`}>→ {m.Manage_membership_requests()}</A>
	</div>
</ProtectedOrgUI>
