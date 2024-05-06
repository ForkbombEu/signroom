<script lang="ts">
	import ProtectedOrgLayout from '$lib/rbac/protectedOrgLayout.svelte';

	export let data;
</script>

<ProtectedOrgLayout orgId={data.organization.id}>
	<slot />
</ProtectedOrgLayout>
