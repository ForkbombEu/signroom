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
	[FieldType.FILE]: z.instanceof(File),
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
		maxSize: (s, o) => {
			const maxSize = o.maxSize as number;
			return s.refine((file) => file.size < maxSize, `File size bigger than ${maxSize} bytes`);
		},
		mimeTypes: (s, o) => {
			const mimeTypes = o.mimeTypes as string[];
			if (mimeTypes.length === 0) return s;
			return s.refine(
				(file) => mimeTypes.includes(file.type),
				`File type not: ${mimeTypes.join(', ')}`
			);
		}
	},
	[FieldType.SELECT]: {
		values: (s, o) => {
			const values = o.values as string[];
			return s.refine((value) => values.includes(value), `Value not: ${values.join(', ')}`);
		}
	},
	[FieldType.BOOL]: {},
	[FieldType.EDITOR]: {},
	[FieldType.RELATION]: {}
};

//

export function isArrayField(fieldSchema: FieldSchema): boolean {
	const type = fieldSchema.type;
	if (type !== FieldType.SELECT && type !== FieldType.RELATION && type !== FieldType.FILE)
		return false;
	if (fieldSchema.options.maxSelect === 1) return false;
	else return true;
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

	const refiners = FieldTypeRefiners[type];
	for (const [key, refiner] of Object.entries(refiners)) {
		if (fieldschema.options[key]) zodSchema = refiner(zodSchema, fieldschema.options);
	}

	if (!fieldschema.required) zodSchema = zodSchema.nullish();

	if (!isArrayField(fieldschema)) return zodSchema;
	else {
		let arraySchema = z.array(zodSchema);
		for (const [key, refiner] of Object.entries(arrayRefiners)) {
			if (fieldschema.options[key])
				arraySchema = refiner(arraySchema as ZodArrayAny, fieldschema.options);
		}
		if (fieldschema.required) return arraySchema.nonempty();
		else return arraySchema;
	}
}
/**
 * Important note:
 * For an array to be marked as optional by superforms constraints,
 * all the items inside the array must be optional.
 */

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
