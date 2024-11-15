<script lang="ts">
	import { verifyUserRole } from './verify-authorizations';
	import type { OrgRole } from '.';

	export let orgId: string;
	export let roles: OrgRole[];
</script>

{#await verifyUserRole(orgId, roles) then response}
	{#if response.hasRole}
		<slot />
	{/if}
{/await}
