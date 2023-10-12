<script lang="ts">
	import type { InputMode as RelationInputMode } from '$lib/components/relationsManager.svelte';
	import {
		Checkbox,
		File,
		Hidden,
		Input,
		Relations,
		Select,
		Textarea,
		type RelationDisplayFields
	} from '$lib/forms/fields';
	import { isArrayField } from '$lib/pocketbase/schema';
	import { type FieldSchema, FieldType } from '$lib/pocketbase/schema/types';

	//

	export let fieldSchema: FieldSchema;
	export let hidden = false;
	export let relationDisplayFields: RelationDisplayFields = [];
	export let relationInputMode: RelationInputMode = 'search';

	const field = fieldSchema.name;
	const label = fieldSchema.name;

	const multiple = isArrayField(fieldSchema);

	/* Select */

	let options: string[] = [];
	if (fieldSchema.type == FieldType.SELECT) {
		options = fieldSchema.options.values as string[];
	}

	/* File */

	let accept: string[];
	if (fieldSchema.type == FieldType.FILE) {
		accept = fieldSchema.options.mimeTypes as string[];
	}

	/* Relation */

	let collectionId: string;
	let max: number;
	if (fieldSchema.type == FieldType.RELATION) {
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
	<File {field} {label} {multiple} {accept} />
{:else if fieldSchema.type == FieldType.SELECT}
	<Select {field} {label} {options} {multiple} />
{:else if fieldSchema.type == FieldType.EDITOR}
	<Textarea {field} {label} />
{:else if fieldSchema.type == FieldType.RELATION}
	<Relations
		{field}
		{label}
		{multiple}
		collection={collectionId}
		displayFields={relationDisplayFields}
		inputMode={relationInputMode}
		{max}
	/>
{/if}