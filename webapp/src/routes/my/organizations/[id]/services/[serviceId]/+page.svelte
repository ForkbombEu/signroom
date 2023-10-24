<script lang="ts">
	import ServiceForm from '../_partials/serviceForm.svelte';

	export let data;
</script>

<pre>{JSON.stringify(data, null, 2)}</pre>
<ServiceForm organizationId={data.organization.id} initialData={data.service} />
