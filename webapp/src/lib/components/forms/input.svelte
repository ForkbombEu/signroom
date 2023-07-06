<script lang="ts">
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import { getFormContext } from './form.svelte';
	import { Input } from 'flowbite-svelte';
	import type { InputType } from 'flowbite-svelte/dist/types';
	import FieldWrapper from './fieldParts/fieldWrapper.svelte';

	export let field: string;
	export let label = '';
	export let type: InputType = 'text';
	export let id = '';
	export let placeholder = '';

	const { superform } = getFormContext();
	const { value, errors, constraints } = formFieldProxy(superform, field);
</script>

<FieldWrapper {field} {label}>
	<Input
		{id}
		{type}
		color={$errors ? 'red' : 'base'}
		name={field}
		data-invalid={$errors}
		bind:value={$value}
		{...$constraints}
		{placeholder}
	/>
</FieldWrapper>
