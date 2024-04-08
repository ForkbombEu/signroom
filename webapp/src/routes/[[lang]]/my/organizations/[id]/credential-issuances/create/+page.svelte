<script lang="ts">
	import PageContent from '$lib/components/pageContent.svelte';
	import PageTop from '$lib/components/pageTop.svelte';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import { goto, m } from '$lib/i18n';
	import { ServicesCryptographyOptions } from '$lib/pocketbase/types';
	import { Button } from 'flowbite-svelte';
	import ServiceForm from '../_partials/serviceForm.svelte';
	import Icon from '$lib/components/icon.svelte';
	import { ArrowLeft } from 'svelte-heros-v2';

	export let data;
</script>

<PageTop>
	<Button href={`/my/organizations/${data.organization.id}/credential-issuances`} outline size="xs">
		<Icon src={ArrowLeft} mr></Icon>
		{m.Close_and_discard()}
	</Button>

	<SectionTitle title={m.New_issuance_flow()} description={m.new_issuance_flow_description()} />
</PageTop>

<PageContent>
	<ServiceForm
		organizationId={data.organization.id}
		initialData={{
			cryptography: ServicesCryptographyOptions['sd-jwt'],
			api_available: true
		}}
		on:success={(e) => {
			goto(`/my/organizations/${data.organization.id}/credential-issuances/${e.detail.record.id}`);
		}}
	/>
</PageContent>
