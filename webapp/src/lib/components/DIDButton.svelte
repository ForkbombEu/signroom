<script>
	import { featureFlags } from '$lib/features';
	import { currentUser } from '$lib/pocketbase';
	import { Button } from 'flowbite-svelte';
</script>

{#if $featureFlags.DID}
	<Button
		href="https://explorer.did.dyne.org/details/did:dyne:sandbox.signroom:{$currentUser?.eddsa_public_key}"
		target="_blank"
		size="xs"
		class="ml-3"
		color="light">My DID</Button
	>
{/if}
