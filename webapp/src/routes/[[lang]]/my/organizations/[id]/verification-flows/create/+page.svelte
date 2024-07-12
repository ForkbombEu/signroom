<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import PageContent from '$lib/components/pageContent.svelte';
	import PageTop from '$lib/components/pageTop.svelte';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import { m } from '$lib/i18n';
	import { Button } from 'flowbite-svelte';
	import ServiceForm from '../_partials/verificationFlowForm.svelte';
	import Icon from '$lib/components/icon.svelte';
	import { ArrowLeft } from 'svelte-heros-v2';

	export let data;
</script>

<PageTop>
	<Button href={`/my/organizations/${data.organization.id}/verification-flows`} outline size="xs">
		<Icon src={ArrowLeft} mr />
		{m.Close_and_discard()}
	</Button>

	<SectionTitle
		title={m.New_verification_flow()}
		description={m.new_verification_flow_description()}
	/>
</PageTop>

<PageContent>
	<ServiceForm
		organizationId={data.organization.id}
		on:success={(e) => {
			window.location.replace(
				`/my/organizations/${data.organization.id}/verification-flows/${e.detail.record.id}`
			);
		}}
	/>
</PageContent>
