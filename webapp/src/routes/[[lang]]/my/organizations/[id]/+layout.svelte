<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import ProtectedOrgLayout from '$lib/rbac/protectedOrgLayout.svelte';

	export let data;
</script>

<ProtectedOrgLayout orgId={data.organization.id}>
	<slot />
</ProtectedOrgLayout>
