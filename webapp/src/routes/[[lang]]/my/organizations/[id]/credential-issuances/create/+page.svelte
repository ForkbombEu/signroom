<script lang="ts">
	import { ServicesCredentialTypeOptions } from '$lib/pocketbase/types';
	import ServiceForm from '../_partials/serviceForm.svelte';
	export let data;
</script>

<ServiceForm
	organizationId={data.organization.id}
	initialData={{
		credential_type: ServicesCredentialTypeOptions['sd-jwt']
	}}
/>
