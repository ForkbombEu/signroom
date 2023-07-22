<script lang="ts" context="module">
	import type { RelationDisplayFields } from '$lib/components/forms/relations.svelte';
	import type { ValueOf } from '$lib/utils/types';
	import type { Record as PBRecord } from 'pocketbase';
	import type { InputMode as RelationInputMode } from '$lib/components/relationsManager.svelte';

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
		relationsInputMode: Record<string, RelationInputMode>;
		hiddenFields: string[];
		hiddenFieldsValues: HiddenFieldsValues;
	};

	export function defaultFormSettings(): FormSettings {
		return {
			fieldsOrder: [],
			excludedFields: [],
			relationsDisplayFields: {},
			relationsInputMode: {},
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
	import { fieldsSchemaToZod } from './collectionSchemaToZod';
	import type { Collections } from '$lib/pocketbase-types';
	import FieldSchemaToInput from './fieldSchemaToInput.svelte';
	import type { FieldSchema } from './types';
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
	import FormError from '$lib/components/forms/formError.svelte';
	import SubmitButton from '$lib/components/forms/submitButton.svelte';
	//

	export let collection: Collections | string;
	export let mode: FormMode;
	export let initialData: any = {};

	export let formSettings: Partial<FormSettings> = {};
	export let submitButtonText = '';

	//

	let {
		fieldsOrder,
		excludedFields,
		relationsDisplayFields,
		hiddenFields,
		hiddenFieldsValues,
		relationsInputMode
	} = {
		...defaultFormSettings(),
		...formSettings
	};

	const dispatch = createEventDispatcher<{
		success: {
			record: PBRecord;
		};
	}>();

	/* Schema generation */

	const collectionSchema = getCollectionSchema(collection)!;
	const fieldsSchema = collectionSchema.schema.sort(sortFieldsSchema).filter(filterFieldsSchema);
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
				let record: PBRecord;
				if (mode == formMode.EDIT && initialData && initialData.id) {
					record = await pb.collection(collection).update(initialData.id, formData);
				} else {
					record = await pb.collection(collection).create(formData);
				}
				dispatch('success', { record });
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

	//

	submitButtonText = Boolean(submitButtonText)
		? submitButtonText
		: mode == formMode.EDIT
		? 'Edit record'
		: 'Create record';
</script>

<Form {superform} on:success showRequiredIndicator>
	{#each fieldsSchema as fieldSchema}
		{@const hidden = hiddenFields.includes(fieldSchema.name)}
		{@const relationDisplayFields = relationsDisplayFields[fieldSchema.name] || []}
		{@const relationInputMode = relationsInputMode[fieldSchema.name] || 'search'}
		<FieldSchemaToInput {fieldSchema} {hidden} {relationDisplayFields} {relationInputMode} />
	{/each}

	<FormError />

	<div class="flex justify-end">
		<SubmitButton>{submitButtonText}</SubmitButton>
	</div>
</Form>
