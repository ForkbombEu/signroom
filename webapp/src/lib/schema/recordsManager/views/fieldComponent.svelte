<script lang="ts" context="module">
	import type { Record as PBRecord } from 'pocketbase';
	import type { SvelteComponentTyped } from 'svelte';

	export type FieldComponent<RecordGeneric = unknown> = typeof SvelteComponentTyped<{
		value: unknown;
		record: RecordGeneric & PBRecord;
	}>;

	export type FieldsComponents<RecordGeneric = unknown> = Record<
		string,
		FieldComponent<RecordGeneric>
	>;
</script>

<script lang="ts">
	type RecordGeneric = $$Generic;

	export let record: PBRecord & RecordGeneric;
	export let field: string;
	export let component: FieldComponent | undefined;
</script>

{#if component}
	<svelte:component this={component} {record} value={record[field]} />
{:else}
	<div>
		{record[field]}
	</div>
{/if}
