<script lang="ts" context="module">
	import type { RelationDisplayFields } from '$lib/forms/fields';
	import type { InputMode as RelationInputMode } from '$lib/components/relationsManager.svelte';

	export type RelationFieldSettings = {
		displayFields: RelationDisplayFields;
		inputMode: RelationInputMode;
	};

	export type FieldsSettings<T> = {
		order: Array<keyof T>;
		exclude: Array<keyof T>;
		hide: { [K in keyof T]?: T[K] };
		relations: { [K in keyof T]?: Partial<RelationFieldSettings> };
	};
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { pb } from '$lib/pocketbase';

	import type { Collections } from '$lib/pocketbase/types';
	import type { FieldSchema } from './types';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import type { AnyZodObject } from 'zod';
	import type { ClientResponseErrorData } from '$lib/errorHandling';

	import { Form, createForm, createFormData, FormError, SubmitButton } from '$lib/forms';
	import {
		cleanFormDataFiles,
		getFileFieldsInitialData,
		mockFileFieldsInitialData
	} from './CRUDFormSetup';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { getCollectionSchema } from './getCollectionSchema';
	import { fieldsSchemaToZod } from './collectionSchemaToZod';
	import FieldSchemaToInput from './fieldSchemaToInput.svelte';
	import type { PBRecord, PBResponse } from '$lib/utils/types';

	//

	type RecordGeneric = $$Generic<PBRecord>;
	export let recordType = createTypeProp<RecordGeneric>();
	recordType;

	//

	export let collection: Collections | string;
	export let initialData: Partial<RecordGeneric> = {};
	export let recordId = '';

	export let fieldsSettings: Partial<FieldsSettings<RecordGeneric>> = {};
	let { order = [], exclude = [], hide, relations } = fieldsSettings;

	export let submitButtonText = '';

	//

	const dispatch = createEventDispatcher<{
		success: {
			record: PBResponse<RecordGeneric>;
		};
		edit: {
			record: PBResponse<RecordGeneric>;
		};
		create: {
			record: PBResponse<RecordGeneric>;
		};
	}>();

	/* Schema generation */

	const collectionSchema = getCollectionSchema(collection)!;
	const fieldsSchema = collectionSchema.schema.sort(sortFieldsSchema).filter(filterFieldsSchema);
	const zodSchema = fieldsSchemaToZod(fieldsSchema);

	/* Superform creation */

	let superform: SuperForm<AnyZodObject, ClientResponseErrorData>;

	$: {
		const seededData = { ...initialData };
		if (hide) {
			for (const [field, value] of Object.entries(hide)) {
				seededData[field as keyof RecordGeneric] = value;
			}
		}

		const mockedData = mockFileFieldsInitialData(collectionSchema, seededData);
		const fileFieldsInitialData = getFileFieldsInitialData(collectionSchema, initialData);

		superform = createForm(
			zodSchema,
			async ({ form }) => {
				const data = cleanFormDataFiles(form.data, fileFieldsInitialData);
				const formData = createFormData(data);
				let record: PBResponse<RecordGeneric>;
				if (Boolean(recordId)) {
					record = await pb.collection(collection).update(recordId, formData);
					dispatch('edit', { record });
				} else {
					record = await pb.collection(collection).create(formData);
					dispatch('create', { record });
				}
				dispatch('success', { record });
			},
			mockedData
		);
	}

	/* Schema filters */

	function sortFieldsSchema(a: any, b: any) {
		const aIndex = order.indexOf(a.name);
		const bIndex = order.indexOf(b.name);
		if (aIndex === -1 && bIndex === -1) {
			return 0;
		}
		if (aIndex === -1) {
			return 1;
		}
		if (bIndex === -1) {
			return -1;
		}
		return aIndex - bIndex;
	}

	function filterFieldsSchema(schema: FieldSchema) {
		return !exclude.includes(schema.name as keyof RecordGeneric);
	}

	/* */

	submitButtonText = Boolean(submitButtonText)
		? submitButtonText
		: Boolean(recordId)
		? 'Edit record'
		: 'Create record';
</script>

<Form {superform} on:success showRequiredIndicator>
	{#each fieldsSchema as fieldSchema}
		{@const hidden = hide ? Object.keys(hide).includes(fieldSchema.name) : false}
		{@const relationFieldSettings = relations?.[fieldSchema.name]}
		{@const relationDisplayFields = relationFieldSettings?.displayFields ?? []}
		{@const relationInputMode = relationFieldSettings?.inputMode ?? 'search'}
		<FieldSchemaToInput {fieldSchema} {hidden} {relationDisplayFields} {relationInputMode} />
	{/each}

	<FormError />

	<div class="flex justify-end">
		<SubmitButton>{submitButtonText}</SubmitButton>
	</div>
</Form>
