<script lang="ts">
	import PageContent from '$lib/components/pageContent.svelte';
	import PageTop from '$lib/components/pageTop.svelte';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import { goto, m } from '$lib/i18n';
	import { Button } from 'flowbite-svelte';
	import ServiceForm from '../../_partials/verificationFlowForm.svelte';
	import Icon from '$lib/components/icon.svelte';
	import { ArrowLeft } from 'svelte-heros-v2';
	import OrganizationBreadcrumbs from '$lib/components/organizationBreadcrumbs.svelte';
	import { invalidateAll } from '$app/navigation';

	export let data;
</script>

<PageTop>
	<OrganizationBreadcrumbs></OrganizationBreadcrumbs>

	<Button
		href={`/my/organizations/${data.organization.id}/verification-flows/${data.verification_flow_id}`}
		outline
		size="xs"
	>
		<Icon src={ArrowLeft} mr></Icon>
		{m.Close_and_discard()}
	</Button>

	<SectionTitle title={`${m.Edit_verification_flow()} – ${data.verificationFlow.name}`} />
</PageTop>

<PageContent>
	<ServiceForm
		organizationId={data.organization.id}
		verificationFlowId={data.verificationFlow.id}
		initialData={data.verificationFlow}
		on:success={async (e) => {
			await invalidateAll();
			goto(`/my/organizations/${data.organization.id}/verification-flows/${e.detail.record.id}`);
		}}
	/>
</PageContent>
