<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import PageTop from '$lib/components/pageTop.svelte';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import { m } from '$lib/i18n';
</script>

<PageTop>
	<SectionTitle title={m.Signatures()} description={m.signatures_description()} />
</PageTop>

<slot />
