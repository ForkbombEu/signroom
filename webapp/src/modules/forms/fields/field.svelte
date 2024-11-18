<script lang="ts" generics="Data extends GenericRecord">
	import type { GenericRecord } from '@/utils/types';
	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import type { FormPathLeaves, SuperForm } from 'sveltekit-superforms';
	import { numberProxy, fieldProxy } from 'sveltekit-superforms';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import FieldWrapper from './parts/fieldWrapper.svelte';
	import type { FieldOptions } from './types';

	export let form: SuperForm<Data>;
	export let name: FormPathLeaves<Data, string | number>;
	export let options: Partial<FieldOptions & HTMLInputAttributes> = {};

	//

	let { form: formData } = form;

	const numberValue = numberProxy(formData, name);
	const textValue = fieldProxy(formData, name);

	$: valueProxy = options.type == 'number' ? numberValue : textValue;

	//

	const defaultPlaceholders: Record<string, string> = {
		text: 'abc',
		email: 'email@example.org',
		url: 'https://www.website.org'
	};

	$: placeholder = Boolean(options.placeholder)
		? options.placeholder
		: defaultPlaceholders[options.type ?? 'text'];
</script>

<Form.Field {form} {name}>
	<FieldWrapper field={name} {options} let:attrs>
		{#if valueProxy}
			<Input {...options} {placeholder} {...attrs} bind:value={$valueProxy} />
		{/if}
	</FieldWrapper>
</Form.Field>
