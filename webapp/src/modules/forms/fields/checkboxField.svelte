<script lang="ts" context="module">
	import type { GenericRecord } from '@/utils/types';
</script>

<script lang="ts" generics="Data extends GenericRecord">
	import type { SuperForm } from 'sveltekit-superforms';
	import { fieldProxy, type FormPathLeaves } from 'sveltekit-superforms/client';

	import * as Form from '@/components/ui/form';
	import { Checkbox } from '@/components/ui/checkbox';

	import type { FieldOptions } from './types';
	import type { ComponentProps } from 'svelte';
	import type { Writable } from 'svelte/store';

	import { capitalize } from 'effect/String';
	import RequiredIndicator from '../components/requiredIndicator.svelte';

	//

	export let form: SuperForm<Data, any>;
	export let name: FormPathLeaves<Data, boolean>;
	export let options: Partial<FieldOptions> & ComponentProps<Checkbox> = {};

	//

	const value: Writable<boolean> = fieldProxy(form, name);
</script>

<Form.Field {form} {name}>
	<Form.Control let:attrs>
		<div class="flex items-center gap-2">
			<Checkbox {...attrs} bind:checked={$value} />

			<Form.Label>
				<slot>
					{options.label ?? capitalize(name)}
				</slot>
				<RequiredIndicator field={name} />
			</Form.Label>
		</div>
	</Form.Control>

	{#if options.description}
		<Form.Description>{options.description}</Form.Description>
	{/if}

	<Form.FieldErrors />
</Form.Field>
