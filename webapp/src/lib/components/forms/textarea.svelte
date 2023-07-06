<script lang="ts">
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import { Textarea } from 'flowbite-svelte';
	import { getFormContext } from './form.svelte';
	import FieldWrapper from './fieldParts/fieldWrapper.svelte';

	export let field: string;
	export let label = '';
	export let placeholder = '';

	const { superform } = getFormContext();
	const { value, errors, constraints } = formFieldProxy(superform, field);
</script>

<FieldWrapper {field} {label}>
	<Textarea
		bind:value={$value}
		class="!min-h-[200px]"
		color={$errors ? 'red' : 'base'}
		name={field}
		data-invalid={$errors}
		{placeholder}
		{...$constraints}
	/>
</FieldWrapper>
