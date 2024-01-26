<script lang="ts">
	import { request, requestSchema, type RequestBody } from '@api/downloadCredentialIssuer';
	import { downloadBlob } from '$lib/utils/downloadBlob';

	import ServiceForm from '../_partials/serviceForm.svelte';
	import { Form, createForm, Input, SubmitButton } from '$lib/forms';

	import { createToggleStore } from '$lib/components/utils/toggleStore';
	import PortalWrapper from '$lib/components/portalWrapper.svelte';
	import { Button, Heading, Hr, Modal } from 'flowbite-svelte';
	import { ArrowDownTray } from 'svelte-heros-v2';

	//

	export let data;

	//

	const modalDisplay = createToggleStore(false);

	const superform = createForm(
		requestSchema,
		async ({ form }) => {
			await downloadCredentialIssuer(form.data);
		},
		{
			credential_name: data.service.name,
			credential_issuer_name: data.organization.name,
			templates: data.service.expand?.templates.map((t) => t.schema) ?? []
		}
	);

	async function downloadCredentialIssuer(data: RequestBody) {
		const response = await request(data);
		if (response.ok) {
			const blob = new Blob([await response.arrayBuffer()], { type: 'application/zip' });
			downloadBlob(blob, 'credential-issuer.zip');
		}
	}
</script>

<div class="space-y-8">
	<div class="flex justify-end">
		<Button color="alternative" on:click={modalDisplay.on}>
			<ArrowDownTray />
			<span class="ml-2"> Download credential issuer </span>
		</Button>
	</div>

	<Hr />

	<Heading tag="h4">Edit service</Heading>
	<ServiceForm organizationId={data.organization.id} initialData={data.service} mode="edit" />

	<Hr />

	<Heading tag="h4">Service preview</Heading>
	<div class="max-h-96 overflow-scroll border rounded-lg p-4">
		<pre>{JSON.stringify(data.service, null, 2)}</pre>
	</div>
</div>

<PortalWrapper>
	<Modal bind:open={$modalDisplay} title="Download credential issuer">
		<Form {superform}>
			<Input
				{superform}
				field="credential_issuer_url"
				options={{
					label: 'Credential issuer URL'
				}}
			/>
			<Input
				{superform}
				field="authorization_server"
				options={{
					label: 'Authorization server'
				}}
			/>
			<div class="flex justify-end">
				<SubmitButton>
					<ArrowDownTray />
					<span class="ml-2"> Download credential issuer </span>
				</SubmitButton>
			</div>
		</Form>
	</Modal>
</PortalWrapper>
