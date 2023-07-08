<script lang="ts">
	import Checkbox from '$lib/components/forms/checkbox.svelte';
	import File from '$lib/components/forms/file.svelte';
	import Hidden from '$lib/components/forms/hidden.svelte';
	import Input from '$lib/components/forms/input.svelte';
	import Relations, { type RelationDisplayFields } from '$lib/components/forms/relations.svelte';
	import Select from '$lib/components/forms/select.svelte';
	import Textarea from '$lib/components/forms/textarea.svelte';
	import { isArrayField } from './collectionSchemaToZod';
	import { type FieldSchema, FieldType } from './types';

	//

	export let fieldSchema: FieldSchema;
	export let hidden = false;
	export let relationDisplayFields: RelationDisplayFields = [];

	const field = fieldSchema.name;
	const label = fieldSchema.name;

	/* Select */

	let options: string[] = [];
	if (fieldSchema.type == FieldType.SELECT) {
		options = fieldSchema.options.values as string[];
	}

	/* File */

	let multipleFile: boolean;
	let accept: string[];
	if (fieldSchema.type == FieldType.FILE) {
		multipleFile = fieldSchema.options.maxSelect != 1;
		accept = fieldSchema.options.mimeTypes as string[];
	}

	/* Relation */

	let multipleRelation: boolean;
	let collectionId: string;
	let max: number;
	if (fieldSchema.type == FieldType.RELATION) {
		multipleRelation = isArrayField(fieldSchema);
		collectionId = fieldSchema.options.collectionId as string;
		max = fieldSchema.options.maxSelect as number;
	}
</script>

{#if hidden}
	<Hidden {field} />
{:else if fieldSchema.type == FieldType.TEXT}
	<Input {field} {label} />
{:else if fieldSchema.type == FieldType.BOOL}
	<Checkbox {field}>{label}</Checkbox>
{:else if fieldSchema.type == FieldType.FILE}
	<File {field} {label} multiple={multipleFile} {accept} />
{:else if fieldSchema.type == FieldType.SELECT}
	<Select {field} {label} {options} />
{:else if fieldSchema.type == FieldType.EDITOR}
	<Textarea {field} {label} />
{:else if fieldSchema.type == FieldType.RELATION}
	<Relations
		{field}
		{label}
		multiple={multipleRelation}
		collection={collectionId}
		displayFields={relationDisplayFields}
		{max}
	/>
{/if}
