<script lang="ts">
	import { currentUser } from '$lib/pocketbase';
	import type { SignaturesRecord } from '$lib/pocketbase/types';
	import type { PBResponse } from '$lib/utils/types';
	import { Badge } from 'flowbite-svelte';

	export let value: string;
	export let record: PBResponse<SignaturesRecord>;
	record;

	const isOwned = $currentUser?.id === value;
</script>

{#if !isOwned}
	<Badge color="blue">shared</Badge>
{/if}
