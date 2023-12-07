<script lang="ts">
	import { Button, Hr } from 'flowbite-svelte';
	import { ArrowDownTray } from 'svelte-heros-v2';
	import ServiceForm from '../_partials/serviceForm.svelte';

	export let data;
</script>

<div class="space-y-8">
	<div class="flex justify-end">
		<Button color="alternative">
			<ArrowDownTray></ArrowDownTray>
			<span class="ml-2"> Download credential issuer </span>
		</Button>
	</div>
	<Hr />
	<div class="max-h-96 overflow-scroll border rounded-lg p-4">
		<pre>{JSON.stringify(data, null, 2)}</pre>
	</div>
	<Hr />
	<ServiceForm organizationId={data.organization.id} initialData={data.service} mode="edit" />
</div>
