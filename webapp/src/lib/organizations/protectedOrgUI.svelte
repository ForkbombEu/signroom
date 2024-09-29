<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { verifyUserRole } from './verify-authorizations';
	import type { OrgRole } from './roles';

	export let orgId: string;
	export let roles: OrgRole[];
</script>

{#await verifyUserRole(orgId, roles) then response}
	{#if response.hasRole}
		<slot />
	{/if}
{/await}
