import type { ValueOf } from '$lib/utils/types';

//

export const FieldType = {
	TEXT: 'text',
	EDITOR: 'editor',
	BOOL: 'bool',
	FILE: 'file',
	SELECT: 'select',
	RELATION: 'relation'
} as const;

export type FieldType = ValueOf<typeof FieldType>;

// Types generated parsing ./pb_schema.json with https://transform.tools/json-to-typescript

export interface CollectionSchema {
	id: string;
	name: string;
	type: string;
	system: boolean;
	schema: FieldSchema[];
	indexes: string[];
	listRule: string | null;
	viewRule: string | null;
	createRule: string | null;
	updateRule: string | null;
	deleteRule: string | null;
	options: Record<string, unknown>;
}

export interface FieldSchema {
	id: string;
	name: string;
	type: string;
	system: boolean;
	required: boolean;
	options: Record<string, unknown>;
}
