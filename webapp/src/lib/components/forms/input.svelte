<script lang="ts">
	import { formFieldProxy } from 'sveltekit-superforms/client';

	import { Helper, Input, Label } from 'flowbite-svelte';
	import { getFormContext } from './form.svelte';
	import type { InputType } from 'flowbite-svelte/dist/types';

	export let field: string;
	export let label = '';
	export let type: InputType = 'text';
	export let placeholder = '';

	const { superform } = getFormContext();
	const { value, errors, constraints } = formFieldProxy(superform, field);
</script>

<div class="space-y-2">
	<Label color={$errors ? 'red' : 'gray'} for={field} class="mb-2">{label}</Label>
	<Input
		{type}
		color={$errors ? 'red' : 'base'}
		name={field}
		data-invalid={$errors}
		bind:value={$value}
		{...$constraints}
		{placeholder}
	/>
	{#if $errors}
		<Helper class="mt-2" color="red">{$errors}</Helper>
	{/if}
</div>
