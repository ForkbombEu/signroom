import type { ObjectSchema } from '$lib/jsonSchema/types';
import type AdmZip from 'adm-zip';
import { nanoid } from 'nanoid';

//

export function getZipEntry(zip: AdmZip, entryPathFragment: string) {
	return zip.getEntries().find((entry) => entry.entryName.includes(entryPathFragment));
}

export function editZipEntry(zip: AdmZip, entry: AdmZip.IZipEntry, content: string) {
	zip.updateFile(entry, Buffer.from(content));
}

export function mergeObjectSchemas(schemas: ObjectSchema[]): ObjectSchema {
	if (schemas.length === 1) return schemas[0];

	const mergedSchema: ObjectSchema = { type: 'object', properties: {}, required: [] };
	for (const schema of schemas) {
		const id = nanoid(5);
		mergedSchema.properties[id] = schema;
		mergedSchema.required?.push(id);
	}
	return mergedSchema;
}
