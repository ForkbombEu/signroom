<script lang="ts">
	import { formFieldProxy } from 'sveltekit-superforms/client';

	import { Helper, Label, Select } from 'flowbite-svelte';
	import { getFormContext } from './form.svelte';
	import type { SelectOptionType } from 'flowbite-svelte/dist/types';

	export let field: string;
	export let label = '';
	export let options: string[] = [];

	const selectOptions: Array<SelectOptionType> = options.map((o) => {
		return { value: o, name: o };
	});

	const { superform } = getFormContext();
	const { value, errors, constraints } = formFieldProxy(superform, field);
</script>

<div class="space-y-2">
	<Label color={$errors ? 'red' : 'gray'} for={field} class="mb-2">
		<span>{label}</span>
		<Select
			name={field}
			items={selectOptions}
			bind:value={$value}
			color={$errors ? 'red' : 'base'}
			data-invalid={$errors}
			{...$constraints}
		/>
	</Label>
	{#if $errors}
		<Helper class="mt-2" color="red">{$errors}</Helper>
	{/if}
</div>
