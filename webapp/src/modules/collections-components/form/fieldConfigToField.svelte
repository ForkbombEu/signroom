<script lang="ts" context="module">
	import type { CollectionName } from '@/pocketbase/collections-models/types';
	import type { ExpandProp } from '../types';
</script>

<script lang="ts" generics="C extends CollectionName">
	import type { AnyFieldConfig } from '@/pocketbase/collections-models/types';
	import { getFormContext } from '@/forms';
	import { CheckboxField, FileField, Field, SelectField, TextareaField } from '@/forms/fields';
	import CollectionField, { type CollectionFieldOptions } from '../collectionField.svelte';
	import { getCollectionNameFromId } from '@/pocketbase/collections-models';
	import { isArrayField } from '@/pocketbase/collections-models/utils';
	import type { Selected } from '@/components/custom/selectInput.svelte';
	import type { FieldComponentProp } from './fieldComponent';

	//

	export let fieldConfig: AnyFieldConfig;

	export let label = fieldConfig.name as string;
	export let description: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;
	export let hidden = false;

	export let collectionFieldOptions: Omit<
		CollectionFieldOptions<C, ExpandProp<C>>,
		'collection'
	> = {};

	export let component: FieldComponentProp | undefined = undefined;

	//

	const name = fieldConfig.name;
	const multiple = isArrayField(fieldConfig);
	const { form } = getFormContext();

	/* Select */

	let items: Selected<string>[] = [];
	if (fieldConfig.type == 'select') {
		items = fieldConfig.options.values.map((v) => ({ label: v, value: v }));
	}

	/* File */

	let accept: string;
	if (fieldConfig.type == 'file') {
		accept = fieldConfig.options.mimeTypes.join(',');
	}

	/* Relation */

	let collectionName: C;
	if (fieldConfig.type == 'relation') {
		const collectionId = fieldConfig.options.collectionId;
		collectionName = getCollectionNameFromId(collectionId) as C;
	}
</script>

{#if hidden}
	<!-- Nothing -->
{:else if component}
	<svelte:component
		this={component.component}
		{form}
		field={fieldConfig.name}
		{label}
		{...component.props}
		{...component.events}
	/>
{:else if fieldConfig.type == 'text' || fieldConfig.type == 'url' || fieldConfig.type == 'date' || fieldConfig.type == 'email'}
	<Field {form} {name} options={{ label, description, placeholder, type: fieldConfig.type }} />
{:else if fieldConfig.type == 'number'}
	<Field {form} {name} options={{ label, description, type: 'number', placeholder }} />
{:else if fieldConfig.type == 'json'}
	<TextareaField {form} {name} options={{ label, description, placeholder }} />
{:else if fieldConfig.type == 'bool'}
	<CheckboxField {form} {name} options={{ label, description }} />
{:else if fieldConfig.type == 'file'}
	<FileField {form} {name} options={{ label, multiple, accept, placeholder }} />
{:else if fieldConfig.type == 'select'}
	<SelectField {form} {name} options={{ label, items, multiple, description, placeholder }} />
{:else if fieldConfig.type == 'editor'}
	<TextareaField {form} {name} options={{ label, description, placeholder }} />
{:else if fieldConfig.type == 'relation'}
	<CollectionField
		{form}
		{name}
		collection={collectionName}
		options={{
			...collectionFieldOptions,
			multiple,
			label,
			description
		}}
	/>
{/if}
