<script lang="ts">
	import { A, Heading } from 'flowbite-svelte';
	import { RecordForm } from '$lib/recordForm';
	import { Collections, type OrganizationsResponse } from '$lib/pocketbase/types';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { m } from '$lib/i18n';

	const recordType = createTypeProp<OrganizationsResponse>();

	function handleSuccess(e: CustomEvent<{ record: OrganizationsResponse }>) {
		window.location.assign(`/my/organizations/${e.detail.record.id}`);
	}
</script>

<div class="space-y-8">
	<A href="/my/organizations">← {m.My_organizations()}</A>
	<Heading tag="h4">{m.Create_an_organization()}</Heading>
	<RecordForm
		{recordType}
		collection={Collections.Organizations}
		fieldsSettings={{
			labels: {
				name: m.Organization_name(),
				description: m.Short_description(),
				avatar: m.Avatar()
			}
		}}
		submitButtonText={m.Create_organization()}
		on:success={handleSuccess}
	/>
</div>
