<script lang="ts">
	import { formFieldProxy } from 'sveltekit-superforms/client';

	import { Helper, Label, Textarea } from 'flowbite-svelte';
	import { getFormContext } from './form.svelte';

	export let field: string;
	export let label = '';
	export let placeholder = '';

	const { superform } = getFormContext();
	const { value, errors, constraints } = formFieldProxy(superform, field);
</script>

<div class="space-y-2">
	{#if label}
		<Label color={$errors ? 'red' : 'gray'} for={field} class="mb-2">{label}</Label>
	{/if}
	<Textarea
		bind:value={$value}
		color={$errors ? 'red' : 'base'}
		name={field}
		data-invalid={$errors}
		{placeholder}
		{...$constraints}
	/>
	{#if $errors}
		<Helper class="mt-2" color="red">{$errors}</Helper>
	{/if}
</div>
