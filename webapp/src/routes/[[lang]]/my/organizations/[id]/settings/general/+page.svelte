<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Collections, type OrganizationsResponse } from '$lib/pocketbase/types';
	import { RecordForm } from '$lib/recordForm';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { Heading } from 'flowbite-svelte';
	import { m } from '$lib/i18n';
	import OrganizationLayout from '$lib/components/organizationLayout.svelte';
	import PageCard from '$lib/components/pageCard.svelte';

	//

	export let data;
	$: organization = data.organization;

	const recordType = createTypeProp<OrganizationsResponse>();
</script>

<PageCard>
	<Heading tag="h6" class="mb-6">{m.Manage_your_organization_public_info()}</Heading>
	<RecordForm
		{recordType}
		collection={Collections.Organizations}
		recordId={organization.id}
		initialData={organization}
		submitButtonText={m.Save_changes()}
		on:success={invalidateAll}
	/>
</PageCard>
