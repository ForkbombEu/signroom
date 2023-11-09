<script lang="ts" context="module">
	import type { PBRecord, PBResponse } from '$lib/utils/types';
	import type { SvelteComponent } from 'svelte';

	export type FieldComponent<RecordGeneric extends PBRecord = PBRecord> = typeof SvelteComponent<{
		value?: unknown;
		record?: PBResponse<RecordGeneric>;
	}>;
</script>

<script lang="ts">
	type RecordGeneric = $$Generic<PBRecord>;

	export let record: PBResponse<RecordGeneric>;
	export let field: string;
	export let component: FieldComponent | undefined;
	export let showLabel: boolean = false;

	$: value = record[field];
	$: text = showLabel ? `${field}: ${value}` : field;
</script>

{#if component}
	<svelte:component this={component} {record} {value} />
{:else}
	<div>{text}</div>
{/if}