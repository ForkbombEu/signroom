<script lang="ts">
	import { formFieldProxy } from 'sveltekit-superforms/client';

	import { Checkbox, Label, Helper } from 'flowbite-svelte';
	import { getFormContext } from './form.svelte';

	export let field: string;

	const { superform } = getFormContext();
	const { value, errors, constraints } = formFieldProxy(superform, field);
</script>

<div class="space-y-2">
	<Label color={$errors ? 'red' : 'gray'} for={field} class="mb-2">
		<div class="flex items-center">
			<Checkbox
				color={$errors ? 'red' : 'secondary'}
				bind:checked={$value}
				name={field}
				value="true"
				data-invalid={$errors}
				{...$constraints}
			/>
			<span class="ml-2"><slot /></span>
		</div>
	</Label>
	{#if $errors}
		<Helper class="mt-2" color="red">{$errors}</Helper>
	{/if}
</div>
