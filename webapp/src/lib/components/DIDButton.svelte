<script lang="ts">
	import { getUserDidUrl } from '$lib/did';
	import { featureFlags } from '$lib/features';
	import { Button } from 'flowbite-svelte';

	let url: string | undefined = undefined;

	getUserDidUrl().then((res) => {
		url = res;
	});
</script>

{#if $featureFlags.DID && url}
	<Button href={url} target="_blank" size="xs" class="ml-3" color="light">My DID</Button>
{/if}
