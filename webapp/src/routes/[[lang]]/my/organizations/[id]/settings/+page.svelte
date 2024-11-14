<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { CollectionForm } from '@/collections-components';
	import { m } from '@/i18n';
	import OrganizationLayout from '@/organizations/components/organizationLayout.svelte';
	import PageCard from '@/components/layout/pageCard.svelte';
	import T from '@/components/custom/t.svelte';

	//

	export let data;
	$: organization = data.organization;
</script>

<OrganizationLayout org={organization}>
	<PageCard>
		<T tag="h4" class="mb-6">{m.Manage_your_organization_public_info()}</T>
		<CollectionForm
			collection="organizations"
			recordId={organization.id}
			initialData={organization}
			uiOptions={{
				submitButtonText: m.Save_changes()
			}}
			on:success={invalidateAll}
		/>
	</PageCard>
</OrganizationLayout>
