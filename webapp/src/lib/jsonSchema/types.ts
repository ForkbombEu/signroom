// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { z } from 'zod';

//

/*Copied from 'ajv/dist/compile/rules' */
declare const _jsonTypes: readonly [
	'string',
	'number',
	'integer',
	'boolean',
	'null',
	'object',
	'array'
];
export type JSONType = (typeof _jsonTypes)[number];

/* Copied from forkbomb/wallet/src/lib/JSONSchemaForms/types.ts */

export interface BaseSchema<T extends JSONType> {
	type: T;
	description?: string;
	title?: string;
	enum?: unknown[];
}

export type StringSchema = BaseSchema<'string'> & {
	format?: 'date' | undefined;
};

export type NumberSchema = BaseSchema<'number'>;
export type IntegerSchema = BaseSchema<'integer'>;
export type BooleanSchema = BaseSchema<'boolean'>;

export type ObjectSchema = BaseSchema<'object'> & {
	properties: Record<string, JSONSchema>;
	required?: Array<string>;
};

export type ArraySchema = BaseSchema<'array'> & {
	items: JSONSchema;
};

export type JSONSchema =
	| StringSchema
	| NumberSchema
	| IntegerSchema
	| BooleanSchema
	| ObjectSchema
	| ArraySchema;

//

export const objectSchemaValidator = z.custom<ObjectSchema>(
	(value) =>
		z
			.object({
				type: z.literal('object'),
				properties: z.record(z.string(), z.unknown()),
				required: z.array(z.string()).optional()
			})
			.safeParse(value).success
);
