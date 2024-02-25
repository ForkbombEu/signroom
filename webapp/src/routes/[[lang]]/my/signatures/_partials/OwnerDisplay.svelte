<script lang="ts">
	import { currentUser } from '$lib/pocketbase';
	import type { SignaturesResponse } from '$lib/pocketbase/types';
	import { Badge } from 'flowbite-svelte';
	import { m } from '$lib/i18n';

	export let value: string;
	export let record: SignaturesResponse;
	record;

	const isOwned = $currentUser?.id === value;
</script>

{#if !isOwned}
	<Badge color="blue">{m.shared()}</Badge>
{/if}
