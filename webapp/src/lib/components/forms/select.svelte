<script lang="ts">
	import { getFormContext } from './form.svelte';
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import { Select, MultiSelect } from 'flowbite-svelte';
	import type { SelectOptionType } from 'flowbite-svelte/dist/types';
	import FieldWrapper from './fieldParts/fieldWrapper.svelte';

	export let field: string;
	export let label = '';
	export let options: string[] = [];
	export let multiple = false;

	const selectOptions: Array<SelectOptionType> = options.map((o) => {
		return { value: o, name: o };
	});

	const { superform } = getFormContext();
	const { value, errors, constraints } = formFieldProxy(superform, field);
</script>

<FieldWrapper {field} {label}>
	{#if !multiple}
		<Select
			name={field}
			items={selectOptions}
			bind:value={$value}
			color={$errors ? 'red' : 'base'}
			data-invalid={$errors}
			{...$constraints}
		/>
	{:else}
		<MultiSelect
			name={field}
			items={selectOptions}
			bind:value={$value}
			data-invalid={$errors}
			dropdownClass="bg-white dark:bg-gray-800"
			{...$constraints}
		/>
	{/if}
</FieldWrapper>
