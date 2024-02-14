<script lang="ts">
	import { Button, Heading, Modal } from 'flowbite-svelte';
	import { Form, createForm, FormError, Textarea, SubmitButton } from '$lib/forms';
	import { z } from 'zod';

	let showModal  = false;

	const schema = z.object({
		certificate: z.string(),
		key: z.string()
	});

	const superform = createForm(
		schema,
		async ({ form }) => {
			const { data } = form;
			await addCertifcateAndKey(data);
		}
	);

	const key = localStorage.getItem('certificateKey');
	const certificate = localStorage.getItem('certificate');
	const realCertificate = localStorage.getItem('realCertificate');

	async function addCertifcateAndKey(data: {certificate: string, key: string}) {
		const { certificate, key } = data;

		localStorage.setItem('realCertificate', 'true');
		localStorage.setItem('certificate', certificate);
		localStorage.setItem('certificateKey', key);
		location.reload();
	}
</script>

<div class="p-4 space-y-4">
	<Heading tag="h3">Your Certificate</Heading>
	<pre class="bg-white p-4 border border-slate-200 rounded-lg">{certificate}</pre>
	<Heading tag="h3">Your Key</Heading>
	<pre class="bg-white p-4 border border-slate-200 rounded-lg">{key}</pre>
</div>
{#if realCertificate == 'false'}
	<Button on:click={() => (showModal = true)}> Load personal key and certificate </Button>
	<Modal bind:open={showModal} size="md" title="Key and certificate" placement="center">
		<Form {superform}>
			<Textarea {superform} field="certificate" options={{id: "certificate", type:"text", label:"Insert your certificate"}}/>
			<Textarea {superform} field="key" options={{id: "key", type:"text", label:"Insert your key"}}/>
			<SubmitButton>Submit certificate and key</SubmitButton>
		</Form>
	</Modal>
{/if}