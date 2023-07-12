<script lang="ts">
	import { currentUser } from '$lib/pocketbase';
	import type { SignaturesRecord } from '$lib/pocketbase-types';
	import type { Record } from 'pocketbase';

	export let value: string;
	export let record: Record & SignaturesRecord;
	record;

	const isOwned = $currentUser?.id === value;
</script>

{#if !isOwned}
	<div class='px-3 w-fit py-1 rounded uppercase bg-blue-100 text-blue-800'>Shared</div>
{/if}
