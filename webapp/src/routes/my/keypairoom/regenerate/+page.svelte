<script lang="ts">
	import { getHMAC, regenerateKeypair, saveKeyringToLocalStorage } from '$lib/auth/keypair';
	import { A, Heading, P } from 'flowbite-svelte';

	import Form, { createForm } from '$lib/components/forms/form.svelte';
	import Textarea from '$lib/components/forms/textarea.svelte';
	import { z } from 'zod';

	//

	export let data;

	let success = false;

	const schema = z.object({
		seed: z.string()
	});

	const superform = createForm(schema, async ({ form }) => {
		const seed = form.data.seed;
		const hmac = await getHMAC(data.user?.email);
		const keypair = await regenerateKeypair(seed, hmac);
		saveKeyringToLocalStorage(keypair.keyring);
		success = true;
	});
	const keys = schema.keyof().Enum;

	const { capture, restore } = superform;
	export const snapshot = { capture, restore };

	const textAreaPlaceholder =
		'skin buyer sunset person run push elevator under debris soft surge man';
</script>

{#if !success}
	<Form {superform} defaultSubmitButtonText="Regenerate keys">
		<Heading tag="h4">Regenerate keys</Heading>
		<div>
			<P>You've been redirected here because your private keys are missing.</P>
			<P>Please type here your seed:</P>
		</div>
		<Textarea field={keys.seed} placeholder={textAreaPlaceholder} />
	</Form>
	<A href="/my/keypairoom">Forgot the seed? Regenerate it</A>
{:else}
	<div class="space-y-4 p-6 flex flex-col">
		<Heading tag="h4">Keys regenerated!</Heading>
		<P>
			Your keys have been regenerated. You can now go back to
			<A href="/my/dashboard">your profile</A>.
		</P>
	</div>
{/if}
