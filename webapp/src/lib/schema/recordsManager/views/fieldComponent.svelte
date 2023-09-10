<script lang="ts" context="module">
	import type { PBRecord, PBResponse } from '$lib/utils/types';
	import type { SvelteComponentTyped } from 'svelte';

	export type FieldComponent<RecordGeneric extends PBRecord = PBRecord> =
		typeof SvelteComponentTyped<{
			value: unknown;
			record?: PBResponse<RecordGeneric>;
		}>;

	export type FieldsComponents<RecordGeneric extends PBRecord = PBRecord> = Record<
		string,
		FieldComponent<RecordGeneric>
	>;
</script>

<script lang="ts">
	type RecordGeneric = $$Generic<PBRecord>;

	export let record: PBResponse<RecordGeneric>;
	export let field: string;
	export let component: FieldComponent | undefined;

	const value = record[field];
</script>

{#if component}
	<svelte:component this={component} {record} {value} />
{:else}
	<div>{value}</div>
{/if}
