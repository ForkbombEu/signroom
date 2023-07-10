<script lang="ts" context="module">
	import type { RelationDisplayFields } from '$lib/components/forms/relations.svelte';
	import type { ValueOf } from '$lib/utils/types';
	import type { Record as PBRecord } from 'pocketbase';

	//

	export const formMode = {
		EDIT: 'edit',
		CREATE: 'create'
	} as const;
	export type FormMode = ValueOf<typeof formMode>;

	//

	export type RelationsDisplayFields = Record<string, RelationDisplayFields>;
	export type HiddenFieldsValues = Record<string, unknown>;

	export type FormSettings = {
		fieldsOrder: string[];
		excludedFields: string[];
		relationsDisplayFields: RelationsDisplayFields;
		hiddenFields: string[];
		hiddenFieldsValues: HiddenFieldsValues;
	};

	export function defaultFormSettings(): FormSettings {
		return {
			fieldsOrder: [],
			excludedFields: [],
			relationsDisplayFields: {},
			hiddenFields: [],
			hiddenFieldsValues: {}
		};
	}

	//

	export type InitialData = Record<string, unknown>;
</script>

<script lang="ts">
	import Form, { createForm, createFormData } from '$lib/components/forms/form.svelte';
	import { getCollectionSchema } from './getCollectionSchema';
	import { fieldsSchemaToZod, isArrayField } from './collectionSchemaToZod';
	import type { Collections } from '$lib/pocketbase-types';
	import FieldSchemaToInput from './fieldSchemaToInput.svelte';
	import { FieldType, type FieldSchema } from './types';
	import { pb } from '$lib/pocketbase';
	import { log } from 'debug';
	import { createEventDispatcher } from 'svelte';
	import {
		cleanFormDataFiles,
		getFileFieldsInitialData,
		mockFileFieldsInitialData,
		seedInitialData
	} from './CRUDFormSetup';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import type { AnyZodObject } from 'zod';
	import type { ClientResponseErrorData } from '$lib/errorHandling';

	//

	export let collection: Collections | string;
	export let mode: FormMode;
	export let initialData: any = {};

	export let formSettings: Partial<FormSettings> = {};

	//

	let { fieldsOrder, excludedFields, relationsDisplayFields, hiddenFields, hiddenFieldsValues } = {
		...defaultFormSettings(),
		...formSettings
	};

	const dispatch = createEventDispatcher<{ success: {} }>();

	/* Schema generation */

	const collectionSchema = getCollectionSchema(collection)!;
	const fieldsSchema = collectionSchema.schema
		.sort(sortFieldsSchema)
		.filter(filterFieldsSchema)
		.filter(excludeMultiselect);
	const zodSchema = fieldsSchemaToZod(fieldsSchema);

	/* Superform creation */

	let superform: SuperForm<AnyZodObject, ClientResponseErrorData>;

	$: {
		const seededData = seedInitialData(initialData, hiddenFieldsValues);
		const mockedData = mockFileFieldsInitialData(collectionSchema, seededData);
		const fileFieldsInitialData = getFileFieldsInitialData(collectionSchema, initialData);

		superform = createForm(
			zodSchema,
			async ({ form }) => {
				const data = cleanFormDataFiles(form.data, fileFieldsInitialData);
				const formData = createFormData(data);
				if (mode == formMode.EDIT && initialData && initialData.id) {
					await pb.collection(collection).update(initialData.id, formData);
				} else {
					await pb.collection(collection).create(formData);
				}
				dispatch('success', {});
			},
			mockedData
		);
	}

	/* Schema filters */

	function sortFieldsSchema(a: any, b: any) {
		const aIndex = fieldsOrder.indexOf(a.name);
		const bIndex = fieldsOrder.indexOf(b.name);
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
		return !excludedFields.includes(schema.name);
	}

	function excludeMultiselect(schema: FieldSchema) {
		if (schema.type == FieldType.SELECT && (schema.options.maxSelect as number) > 1) {
			log('multiple select not supported yet');
			return false;
		}
		return true;
	}

	//

	const defaultSubmitButtonText = mode == formMode.EDIT ? 'Edit record' : 'Create record';
</script>

<Form {superform} {defaultSubmitButtonText} on:success showRequiredIndicator>
	{#each fieldsSchema as fieldSchema}
		{@const hidden = hiddenFields.includes(fieldSchema.name)}
		{@const relationDisplayFields = relationsDisplayFields[fieldSchema.name] || []}
		<FieldSchemaToInput {fieldSchema} {hidden} {relationDisplayFields} />
	{/each}
</Form>
