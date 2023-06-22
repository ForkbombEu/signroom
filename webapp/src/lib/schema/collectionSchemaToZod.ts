import { z } from 'zod';
import type { ZodEffects, ZodTypeAny } from 'zod';
import { log } from '$lib/utils/devLog';
import type { ValueOf } from '$lib/utils/types';
import { type FieldSchema, FieldType } from './types';

//

const FieldTypeToZod = {
	[FieldType.TEXT]: z.string(),
	[FieldType.EDITOR]: z.string(),
	[FieldType.BOOL]: z.boolean(),
	[FieldType.FILE]: z.custom<File>((f) => f instanceof File),
	[FieldType.SELECT]: z.string(),
	[FieldType.RELATION]: z.string()
};

type FieldOptions = Record<string, unknown>;

type FieldTypeRefiner<T extends ValueOf<typeof FieldTypeToZod>> = (
	schema: T,
	options: FieldOptions
) => ZodEffects<T> | T;

type FieldTypeRefiners = {
	[key in keyof typeof FieldTypeToZod]: Record<
		string,
		FieldTypeRefiner<(typeof FieldTypeToZod)[key]>
	>;
};

const FieldTypeRefiners: FieldTypeRefiners = {
	[FieldType.TEXT]: {
		min: (s, o) => s.min(o.min as number),
		max: (s, o) => s.max(o.max as number),
		pattern: (s, o) => s.regex(new RegExp(`|${o.pattern}` as string)) // Add a "|" pipe to the regex to allow for empty string (Ciscoheat suggestion)
	},
	[FieldType.FILE]: {
		maxSize: (s, o) => s.refine((file) => file.size < (o.maxSize as number)),
		mimeTypes: (s, o) => s.refine((file) => (o.mimeTypes as string[]).includes(file.type))
	},
	[FieldType.SELECT]: {
		values: (s, o) => s.refine((value) => (o.values as string[]).includes(value))
	},
	[FieldType.BOOL]: {},
	[FieldType.EDITOR]: {},
	[FieldType.RELATION]: {}
};

//

type IsFieldArrayRefiner = (options: FieldOptions) => boolean;

const FieldTypeToArray: Record<string, IsFieldArrayRefiner> = {
	[FieldType.FILE]: (o) => (o.maxSelect as number) > 1,
	[FieldType.SELECT]: (o) => (o.maxSelect as number) > 1,
	[FieldType.RELATION]: (o) => o.maxSelect != 1
};

export function isFieldArray(field: FieldSchema): boolean {
	const refiner = FieldTypeToArray[field.type as FieldType];
	if (!refiner) return false;
	return refiner(field.options);
}

type ZodArrayAny = z.ZodArray<z.ZodTypeAny>;
type ArrayRefiner = (schema: ZodArrayAny, options: FieldOptions) => ZodArrayAny;

const arrayRefiners: Record<string, ArrayRefiner> = {
	maxSelect: (s, o) => s.max(o.maxSelect as number),
	minSelect: (s, o) => s.max(o.maxSelect as number)
};

//

function fieldSchemaToZod(fieldschema: FieldSchema) {
	const type = fieldschema.type as FieldType;
	let zodSchema: ZodTypeAny = FieldTypeToZod[type];
	//
	const refiners = FieldTypeRefiners[type];
	for (const [key, refiner] of Object.entries(refiners)) {
		if (fieldschema.options[key]) zodSchema = refiner(zodSchema, fieldschema.options);
	}
	//
	if (isFieldArray(fieldschema)) {
		zodSchema = z.array(zodSchema);
		for (const [key, refiner] of Object.entries(arrayRefiners)) {
			if (fieldschema.options[key])
				zodSchema = refiner(zodSchema as ZodArrayAny, fieldschema.options);
		}
	}
	//
	if (!fieldschema.required) zodSchema = zodSchema.optional().nullable().nullish();
	//
	return zodSchema;
}

export function fieldsSchemaToZod(fields: FieldSchema[]): z.AnyZodObject {
	const zodSchema: Record<string, ZodTypeAny> = {};
	for (const field of fields) {
		try {
			zodSchema[field.name] = fieldSchemaToZod(field);
		} catch (e) {
			log(e);
			log(field);
		}
	}
	return z.object(zodSchema);
}
