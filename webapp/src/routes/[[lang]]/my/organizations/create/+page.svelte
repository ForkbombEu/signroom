<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { A, Button, Heading } from 'flowbite-svelte';
	import { RecordForm } from '$lib/recordForm';
	import { Collections, type OrganizationsResponse } from '$lib/pocketbase/types';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { m } from '$lib/i18n';
	import PageContent from '$lib/components/pageContent.svelte';
	import PageCard from '$lib/components/pageCard.svelte';
	import PageTop from '$lib/components/pageTop.svelte';
	import { ArrowLeft } from 'svelte-heros-v2';
	import Icon from '$lib/components/icon.svelte';

	const recordType = createTypeProp<OrganizationsResponse>();

	function handleSuccess(e: CustomEvent<{ record: OrganizationsResponse }>) {
		window.location.assign(`/my/organizations/${e.detail.record.id}`);
	}
</script>

<PageTop>
	<Button href="/my/organizations" outline size="xs">
		<Icon src={ArrowLeft} mr></Icon>
		{m.Back_to_my_organizations()}
	</Button>
	<Heading tag="h4">{m.Create_an_organization()}</Heading>
</PageTop>

<PageContent>
	<PageCard>
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
	</PageCard>
</PageContent>
