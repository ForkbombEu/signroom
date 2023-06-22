<script lang="ts" context="module">
	export type RelationDisplayFields = string[];
</script>

<script lang="ts">
	import RelationsManager from '$lib/components/relationsManager.svelte';
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import { getFormContext } from './form.svelte';
	import { Helper, Label } from 'flowbite-svelte';
	import type { Collections } from '$lib/pocketbase-types';

	export let field: string;
	export let label = '';
	export let collection: string | Collections;
	export let multiple: boolean;
	export let displayFields: RelationDisplayFields;
	export let max: number | undefined = undefined;

	const { superform } = getFormContext();
	const { value, errors } = formFieldProxy(superform, field);

	let error: string;
	$: if (Array.isArray($errors)) {
		error = $errors.join('\n');
	}
</script>

<div class="space-y-2">
	<Label for={field}>{label ? label : field}</Label>
	<RelationsManager
		name={field}
		bind:relation={$value}
		{collection}
		{multiple}
		{displayFields}
		{max}
	/>
	{#if error}
		<Helper color="red">{error}</Helper>
	{/if}
</div>
