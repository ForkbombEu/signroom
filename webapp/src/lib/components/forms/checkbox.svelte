<script lang="ts">
	import { formFieldProxy } from 'sveltekit-superforms/client';

	import { Checkbox, Label } from 'flowbite-svelte';
	import { getFormContext } from './form.svelte';
	import FieldError from './fieldParts/fieldError.svelte';
	import FieldRequiredIndicator from './fieldParts/fieldRequiredIndicator.svelte';

	export let field: string;

	const { superform } = getFormContext();
	const { value, errors, constraints } = formFieldProxy(superform, field);
</script>

<div class="space-y-2">
	<Label color={$errors ? 'red' : 'gray'}>
		<div class="flex items-center space-x-2">
			<Checkbox
				color={$errors ? 'red' : 'secondary'}
				bind:checked={$value}
				name={field}
				value="true"
				data-invalid={$errors}
				{...$constraints}
			/>
			<div>
				<span><slot /></span>
				<FieldRequiredIndicator {field} />
			</div>
		</div>
	</Label>
	<FieldError {field} />
</div>
