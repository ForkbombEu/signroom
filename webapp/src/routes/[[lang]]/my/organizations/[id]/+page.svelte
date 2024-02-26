<script lang="ts">
	import { page } from '$app/stores';
	import { A, Heading, Hr, P, List, Li } from 'flowbite-svelte';
	import VanityMetric from '$lib/components/vanityMetric.svelte';
	import { OrgRoles, ProtectedOrgUI } from '$lib/rbac/index.js';
	import { m } from '$lib/i18n';

	export let data;
	let { organization, services, requests } = data;
	const { OWNER, ADMIN } = OrgRoles;

	$: servicesInView = services.slice(0, 4);
</script>

<Heading tag="h3">{organization.name}</Heading>

<Hr />

<div class="flex justify-between">
	<div class="flex space-x-8">
		<VanityMetric number={services.length} text={m.active_services()} />

		<div>
			<P>Latest services</P>
			{#if servicesInView.length}
				<List>
					{#each servicesInView as s}
						<Li>
							<A href={`${$page.url.pathname}/services/${s.id}`}>{s.name}</A>
						</Li>
					{/each}
				</List>
			{/if}
		</div>
	</div>

	<div>
		<A href={`${$page.url.pathname}/services`}>→ {m.View_all_services()}</A>
	</div>
</div>
<ProtectedOrgUI orgId={organization.id} roles={[ADMIN, OWNER]}>
	<Hr />
	
	<div class="flex justify-between items-start">
		<VanityMetric number={requests.length} text={m.Join_requests()} />
		<A href={`${$page.url.pathname}/requests`}>→ {m.Manage_join_requests()}</A>
	</div>
</ProtectedOrgUI>
