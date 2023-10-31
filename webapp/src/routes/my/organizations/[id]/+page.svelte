<script lang="ts">
	import { page } from '$app/stores';
	import { A, Heading, Hr, P, List, Li } from 'flowbite-svelte';
	import VanityMetric from '$lib/components/vanityMetric.svelte';
	import { OrgRoles, ProtectedOrgUI } from '$lib/rbac/index.js';

	export let data;
	let { organization, services, requests } = data;
	const { OWNER, ADMIN } = OrgRoles;

	$: servicesInView = services.slice(0, 4);
</script>

<Heading tag="h3">{organization.name}</Heading>

<Hr />

<div class="flex justify-between">
	<div class="flex space-x-8">
		<VanityMetric number={services.length} text="active services" />

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
		<A href={`${$page.url.pathname}/services`}>→ View all services</A>
	</div>
</div>
<ProtectedOrgUI orgId={organization.id} roles={[ADMIN, OWNER]}>
	<Hr />
	
	<div class="flex justify-between items-start">
		<VanityMetric number={requests.length} text="Join requests" />
		<A href={`${$page.url.pathname}/requests`}>→ Manage join requests</A>
	</div>
</ProtectedOrgUI>
