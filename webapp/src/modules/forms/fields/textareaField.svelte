<script context="module" lang="ts">
	import type { GenericRecord } from '@/utils/types';
</script>

<script lang="ts" generics="Data extends GenericRecord">
	import * as Form from '@/components/ui/form';
	import { Textarea } from '@/components/ui/textarea';
	import type { FormPathLeaves, SuperForm } from 'sveltekit-superforms';
	import { stringProxy } from 'sveltekit-superforms';
	import type { ComponentProps } from 'svelte';
	import FieldWrapper from './parts/fieldWrapper.svelte';
	import type { FieldOptions } from './types';

	//

	export let form: SuperForm<Data>;
	export let name: FormPathLeaves<Data, string | number>;
	export let options: Partial<FieldOptions> & ComponentProps<Textarea> = {};

	//

	let { form: formData } = form;

	const valueProxy = stringProxy(formData, name, { empty: 'undefined' });
</script>

<Form.Field {form} {name}>
	<FieldWrapper field={name} {options} let:attrs>
		<Textarea {...attrs} {...options} bind:value={$valueProxy} />
	</FieldWrapper>
</Form.Field>
