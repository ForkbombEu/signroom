<script lang="ts">
	import { ProtectedOrgLayout, ProtectedOrgUI, OrgRoles } from '$lib/rbac';
	import { Button, ButtonGroup, P } from 'flowbite-svelte';

	export let data;
	$: organization = data.organization;

	const href = (path = '') => `/my/organizations/${organization.id}${path}`;
	const { OWNER, ADMIN } = OrgRoles;
</script>

<!--  -->

<div class="flex justify-end items-center">
	<ProtectedOrgUI orgId={organization.id} roles={[OWNER, ADMIN]}>
		<div class="flex justify-end items-center space-x-4">
			<P color="text-gray-600" size="sm">Settings</P>
			<ButtonGroup>
				<ProtectedOrgUI orgId={organization.id} roles={[OWNER]}>
					<Button href={href('/settings/general')}>General</Button>
				</ProtectedOrgUI>
				<Button href={href('/settings/members')}>Members</Button>
			</ButtonGroup>
		</div>
	</ProtectedOrgUI>
</div>

<ProtectedOrgLayout orgId={organization.id}>
	<slot />
</ProtectedOrgLayout>
