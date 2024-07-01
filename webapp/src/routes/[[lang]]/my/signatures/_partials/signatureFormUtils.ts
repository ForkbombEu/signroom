import { getCollectionSchema, type FieldSchema } from '$lib/pocketbase/schema';
import { Collections, type SignaturesRecord } from '$lib/pocketbase/types';
import { fieldsSchemaToZod } from '$lib/pocketbaseToZod';
import type { ReplaceType } from '$lib/utils/types';
import { pipe, Option as O, Array as A } from 'effect';
import { z } from 'zod';

//

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
	const defaultHiddenFields: Partial<SignatureField>[] = ['signed_file', 'certificate_used'];
	const editHiddenFields: Partial<SignatureField>[] = ['file', 'owner', 'type'];
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
		fieldsSchemaToZod,
		(schema) =>
			schema.extend({
				certificate: z.string()
			})
	);
}

//

export type SignatureFormData = Omit<
	ReplaceType<SignaturesRecord, 'file', File>,
	'signed_file' | 'certificate_used'
> & {
	certificate: string;
};
