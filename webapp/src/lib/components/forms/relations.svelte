<script lang="ts" context="module">
	export type RelationDisplayFields = string[];
</script>

<script lang="ts">
	import RelationsManager from '$lib/components/relationsManager.svelte';
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import { getFormContext } from './form.svelte';
	import type { Collections } from '$lib/pocketbase-types';
	import FieldWrapper from './fieldParts/fieldWrapper.svelte';

	export let field: string;
	export let label = '';
	export let collection: string | Collections;
	export let multiple: boolean;
	export let displayFields: RelationDisplayFields;
	export let max: number | undefined = undefined;

	const { superform } = getFormContext();
	const { value } = formFieldProxy(superform, field);
</script>

<FieldWrapper {field} {label}>
	<RelationsManager
		name={field}
		bind:relation={$value}
		{collection}
		{multiple}
		{displayFields}
		{max}
	/>
</FieldWrapper>
