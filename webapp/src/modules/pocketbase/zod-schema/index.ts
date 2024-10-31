import z from 'zod';

import { fieldConfigToZodTypeMap, type FieldConfigToZodType } from './config';

import { getCollectionModel } from '@/pocketbase/collections-models';
import type { CollectionName } from '@/pocketbase/collections-models/types';
import { isArrayField } from '@/pocketbase/collections-models/utils';

import { pipe } from 'effect';
import type { CollectionZodRawShapes } from '../types';

// Runtime conversion

export type CollectionZodSchema<C extends CollectionName> = z.ZodObject<CollectionZodRawShapes[C]>;

export function createCollectionZodSchema<C extends CollectionName>(
	collection: C
): CollectionZodSchema<C> {
	const { schema: pocketbaseFieldsSchema } = getCollectionModel(collection);
	const entries = pocketbaseFieldsSchema.map((fieldConfig) => {
		const zodTypeConstructor = fieldConfigToZodTypeMap[fieldConfig.type] as FieldConfigToZodType;
		const zodType = pipe(
			zodTypeConstructor(fieldConfig),

			// Array type handling
			(zodType) => {
				if (isArrayField(fieldConfig)) {
					let s = z.array(zodType);
					const { minSelect, maxSelect } = z
						.object({
							minSelect: z.number().nullish(),
							maxSelect: z.number().nullish()
						})
						.parse(fieldConfig.options);
					if (minSelect) s = s.min(minSelect as number);
					if (maxSelect) s = s.max(maxSelect as number);
					return s;
				} else {
					return zodType;
				}
			},

			// Optional type handling
			(zodType) => {
				if (fieldConfig.required) {
					if (zodType instanceof z.ZodArray) return zodType.nonempty();
					else return zodType;
				} else {
					// Extra check for url: https://github.com/colinhacks/zod/discussions/1254
					if (fieldConfig.type == 'url') return zodType.or(z.literal('')).optional();
					else return zodType.optional();
				}
			}
		);

		return [fieldConfig.name, zodType];
	});

	const rawObject = Object.fromEntries(entries);
	return z.object(rawObject) as CollectionZodSchema<C>;
}
