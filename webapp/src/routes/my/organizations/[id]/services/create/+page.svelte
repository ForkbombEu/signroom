<script lang="ts">
	import ServiceForm from '../_partials/serviceForm.svelte';
	export let data;
</script>

<ServiceForm organizationId={data.organization.id}></ServiceForm>
