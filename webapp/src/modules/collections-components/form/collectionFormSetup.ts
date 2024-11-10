import type {
	CollectionName,
	FileSchemaField,
	SchemaFields
} from '@/pocketbase/collections-models';
import { pipe, Record, String } from 'effect';
import type { CollectionFormMode, FieldsOptions, UIOptions } from './formOptions';
import { setError, type FormPathLeaves, type SuperForm } from 'sveltekit-superforms';
import { getCollectionModel } from '@/pocketbase/collections-models';
import { createCollectionZodSchema } from '@/pocketbase/zod-schema';
import z from 'zod';
import type { GenericRecord, MaybePromise } from '@/utils/types';
import { merge, cloneDeep } from 'lodash';
import { pb } from '@/pocketbase';
import { createForm, type FormOptions } from '@/forms';
import { zod } from 'sveltekit-superforms/adapters';
import { ensureArray } from '@/utils/other';
import { getExceptionMessage } from '@/utils/errors';
import { ClientResponseError, type CollectionModel } from 'pocketbase';
import type { CollectionRecords, CollectionResponses, RecordIdString } from '@/pocketbase/types';
import { m } from '@/i18n';
import { toast } from 'svelte-sonner';

//

type SetupCollectionFormProps<C extends CollectionName> = {
	collection: C;
	fieldsOptions: Partial<FieldsOptions<C>>;
	initialData: Partial<CollectionRecords[C]>;
	recordId?: RecordIdString;
	superformsOptions?: FormOptions;
	uiOptions?: UIOptions;
	onSuccess?: (record: CollectionResponses[C], mode: CollectionFormMode) => MaybePromise<void>;
};

export function setupCollectionForm<C extends CollectionName>({
	collection,
	recordId = undefined,
	fieldsOptions = {},
	initialData = {},
	onSuccess = () => {},
	superformsOptions = {},
	uiOptions = {}
}: SetupCollectionFormProps<C>): SuperForm<CollectionRecords[C]> {
	const collectionModel = getCollectionModel(collection) as CollectionModel;

	/* Schema creation */

	const baseSchema = createCollectionZodSchema(collection) as z.AnyZodObject;
	const schema = baseSchema.omit(
		Object.fromEntries((fieldsOptions?.exclude ?? []).map((key) => [key, true]))
	);

	/* Initial data processing */
	/* This must be done for two reasons
	 *
	 * 1. File fields
	 *
	 * Form expects a file,
	 * but file data coming from PocketBase is a string
	 *
	 * We solve it this way:
	 * -  Store the original initial data
	 * -  Convert the strings to "placeholder" files
	 * -  When submitting the form, match the new files with the original filenames
	 *
	 * 2. JSON fields
	 *
	 * JSON fields come from the server as objects
	 * but we edit them on the client as strings
	 *
	 * -
	 *
	 * (Also, useful for seeding and cleaning data)
	 */

	const processedInitialData = pipe(
		merge(cloneDeep(initialData), fieldsOptions?.defaults, fieldsOptions?.hide), // Seeding data
		(data) => removeExcessProperties(data, collectionModel),
		(data) => mockInitialDataFiles(data, collectionModel),
		(data) => stringifyJsonFields(data, collectionModel),
		Record.filter((v) => Boolean(v)) // Useful to remove `undefined` values that sometimes cause problems
	);

	/* Form creation */

	const form = createForm({
		adapter: zod(schema),
		initialData: processedInitialData,
		options: {
			dataType: 'form',
			...superformsOptions
		},

		onSubmit: async ({ form }) => {
			try {
				const data = pipe(
					cleanFormDataFiles(form.data, initialData, collectionModel),
					Record.map((v) => (v === undefined ? null : v)) // IMPORTANT!
				);

				let record: CollectionResponses[C];
				if (recordId) {
					record = await pb.collection(collection).update<CollectionResponses[C]>(recordId, data);
				} else {
					record = await pb.collection(collection).create<CollectionResponses[C]>(data);
				}

				if (uiOptions?.triggerToast) {
					const toastText = uiOptions?.toastText
						? uiOptions?.toastText
						: recordId
							? m.Record_updated_successfully()
							: m.Record_created_successfully();

					toast.success(toastText);
				}

				onSuccess(record, recordId ? 'edit' : 'create');
			} catch (e) {
				if (e instanceof ClientResponseError) {
					const details = e.data.data as Record<
						FormPathLeaves<CollectionRecords[C]>,
						{ message: string; code: string }
					>;

					Record.toEntries(details).forEach(([path, data]) => {
						if (path in form.data) setError(form, path, data.message);
						else setError(form, `${path} - ${data.message}`);
					});

					setError(form, e.message);
				} else {
					setError(form, getExceptionMessage(e));
				}
			}
		}
	});

	//

	return form as SuperForm<CollectionRecords[C]>;
}

//

function removeExcessProperties(recordData: GenericRecord, collectionModel: CollectionModel) {
	const collectionFields = collectionModel.schema.map((f) => f.name);
	return Record.filter(recordData, (_, k) => collectionFields.includes(k));
}

//

function mockInitialDataFiles(recordData: GenericRecord, collectionModel: CollectionModel) {
	return mapRecordDataByFieldType(
		recordData,
		collectionModel,
		'file',
		(fieldValue, fieldConfig) => {
			if (Array.isArray(fieldValue) && fieldValue.every(String.isString)) {
				return fieldValue.map((filename) => mockFile(filename, fieldConfig));
			} else if (String.isString(fieldValue)) {
				return mockFile(fieldValue, fieldConfig);
			} else {
				return fieldValue;
			}
		}
	);
}

function mockFile(filename: string, fileFieldConfig: FileSchemaField) {
	let fileOptions: FilePropertyBag | undefined = undefined;
	const mimeTypes = fileFieldConfig.options.mimeTypes;
	if (Array.isArray(mimeTypes) && mimeTypes.length > 0) {
		fileOptions = { type: mimeTypes[0] };
	}
	const mockFile = new File([], filename, fileOptions);
	return mockFile;
}

//

function stringifyJsonFields(recordData: GenericRecord, collectionModel: CollectionModel) {
	return mapRecordDataByFieldType(recordData, collectionModel, 'json', (fieldValue) => {
		if (!fieldValue) return fieldValue;
		return JSON.stringify(fieldValue);
	});
}

//

export function cleanFormDataFiles(
	recordData: GenericRecord,
	initialData: GenericRecord,
	model: CollectionModel
) {
	const data = cloneDeep(recordData);

	const initialDataFileFields = pipe(
		initialData,
		Record.filter((_, fieldName) => {
			return Boolean(
				model.schema.find(
					(fieldConfig) => fieldConfig.name == fieldName && fieldConfig.type == 'file'
				)
			);
		}),
		Record.filter((v) => Array.isArray(v) || String.isString(v)), // Ensure filenames
		Record.map((v) => ensureArray(v)) // Ensuring array for easier checking
	);

	for (const [field, initialFilenames] of Object.entries(initialDataFileFields)) {
		const newFieldValue = data[field];

		if (newFieldValue === undefined || newFieldValue === null) {
			continue;
		}
		//
		else if (newFieldValue instanceof File) {
			const isFileOld = initialFilenames.includes(newFieldValue.name);
			if (isFileOld) delete data[field];
		}
		//
		else if (Array.isArray(newFieldValue) && newFieldValue.every((v) => v instanceof File)) {
			const allFilenames = newFieldValue.map((file) => file.name);
			const newFiles = newFieldValue.filter((file) => !initialFilenames.includes(file.name));
			const filesToRemove = initialFilenames.filter((filename) => !allFilenames.includes(filename));

			if (newFiles.length === 0) delete data[field];
			else data[field] = newFiles;

			if (filesToRemove.length > 0) data[`${field}-`] = filesToRemove;
		}
	}

	return data;
}

/* Utils */

class FieldConfigNotFound extends Error {}

function mapRecordDataByFieldType<T extends keyof SchemaFields>(
	recordData: GenericRecord,
	model: CollectionModel,
	fieldType: T,
	handler: (value: unknown, fieldConfig: SchemaFields[T]) => unknown
) {
	return pipe(
		recordData,
		Record.map((fieldValue, fieldName) => {
			const fieldConfig = model.schema.find((field) => field.name == fieldName);
			if (!fieldConfig) throw new FieldConfigNotFound();
			if (fieldConfig.type != fieldType) return fieldValue;
			return handler(fieldValue, fieldConfig as SchemaFields[T]);
		})
	);
}
