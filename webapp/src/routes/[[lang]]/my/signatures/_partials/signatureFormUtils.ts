import { getCollectionSchema, type FieldSchema } from '$lib/pocketbase/schema';
import { Collections, type SignaturesRecord } from '$lib/pocketbase/types';
import { fieldsSchemaToZod } from '$lib/pocketbaseToZod';
import { pipe, Option as O, Array as A } from 'effect';

type SignatureField = keyof SignaturesRecord;

function getFieldsSchema() {
	return pipe(
		Collections.Signatures,
		getCollectionSchema,
		O.fromNullable,
		O.getOrThrow,
		(collectionSchema) => collectionSchema.schema
	);
}

function filterFieldsSchema(
	fieldsSchema: FieldSchema[] = [],
	editMode = false,
	hideFolder = false
) {
	const defaultHiddenFields: Partial<SignatureField>[] = ['signed_file'];
	const editHiddenFields: Partial<SignatureField>[] = ['file', 'certificate'];
	const folderField: SignatureField = 'folder';
	return pipe(
		fieldsSchema,
		A.filter((field) => !defaultHiddenFields.includes(field.name as SignatureField)),
		A.filter((field) =>
			editMode ? !editHiddenFields.includes(field.name as SignatureField) : true
		),
		A.filter((field) => (hideFolder ? field.name != folderField : true))
	);
}

export function getSignatureFormSchema(editMode = false, hideFolder = false) {
	return pipe(
		getFieldsSchema(),
		(schema) => filterFieldsSchema(schema, editMode, hideFolder),
		fieldsSchemaToZod
	);
}
