<script lang="ts">
	import PageContent from '$lib/components/pageContent.svelte';
	import PageTop from '$lib/components/pageTop.svelte';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import { m } from '$lib/i18n';
	import { Button } from 'flowbite-svelte';
	import ServiceForm from '../../_partials/serviceForm.svelte';
	import Icon from '$lib/components/icon.svelte';
	import { ArrowLeft } from 'svelte-heros-v2';
	import OrganizationBreadcrumbs from '$lib/components/organizationBreadcrumbs.svelte';

	export let data;
</script>

<PageTop>
	<OrganizationBreadcrumbs></OrganizationBreadcrumbs>

	<Button
		href={`/my/organizations/${data.organization.id}/credential-issuances/${data.issuanceFlowId}`}
		outline
		size="xs"
	>
		<Icon src={ArrowLeft} mr></Icon>
		{m.Close_and_discard()}
	</Button>

	<SectionTitle title={`${m.Edit_issuance_flow()} – ${data.service.name}`} />
</PageTop>

<PageContent>
	<ServiceForm
		organizationId={data.organization.id}
		serviceId={data.issuanceFlowId}
		initialData={data.service}
	/>
</PageContent>
