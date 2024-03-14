import type { ObjectSchema } from '$lib/jsonSchema/types';
import type AdmZip from 'adm-zip';
import { nanoid } from 'nanoid';
import _ from 'lodash';

/* Locales */

export const DEFAULT_LOCALE = 'en-US';

/* Zip handling */

function getZipEntry(zip: AdmZip, entryPathFragment: string) {
	return zip.getEntries().find((entry) => entry.entryName.includes(entryPathFragment));
}

function editZipEntry(zip: AdmZip, entry: AdmZip.IZipEntry, content: string) {
	zip.updateFile(entry, Buffer.from(content));
}

export function updateZipFileContent(
	zip: AdmZip,
	pathFragment: string,
	updater: (content: string) => string
) {
	const zipEntry = getZipEntry(zip, pathFragment);
	if (!zipEntry) throw new Error(`Zip: Not found: ${pathFragment}`);
	const newContent = updater(zipEntry.getData().toString());
	editZipEntry(zip, zipEntry, newContent);
}

/* Object schemas handling */

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

export function mergeObjectSchemasIntoCredentialSubject(
	schemas: ObjectSchema[],
	locale = DEFAULT_LOCALE
): CredentialSubject {
	const subjects = schemas.map((s) => objectSchemaToCredentialSubject(s, locale));
	return _.merge(subjects[0], ...subjects.slice(1));
}

/* JSON Schema to CredentialSubject conversion */

export function objectSchemaToCredentialSubject(
	schema: ObjectSchema,
	locale = DEFAULT_LOCALE
): CredentialSubject {
	let credentialSubject: CredentialSubject = {};

	for (const [propertyName, property] of Object.entries(schema.properties)) {
		//
		if (property.type != 'object' && property.type != 'array') {
			//
			const prop: CredentialSubjectProperty = {
				mandatory: Boolean(schema.required?.includes(propertyName)),
				display: [{ locale, name: property.title ?? propertyName }]
			};
			credentialSubject[propertyName] = prop;
		}
		//
		else if (property.type === 'object') {
			credentialSubject[propertyName] = objectSchemaToCredentialSubject(property);
		}
		//
		else {
			console.log(`Property not handled:`);
			console.log(JSON.stringify(property, null, 2));
		}
	}
	return credentialSubject;
}

// https://openid.github.io/OpenID4VCI/openid-4-verifiable-credential-issuance-wg-draft.html#name-credential-issuer-metadata-2

export type CredentialSubject = {
	[key: string]: CredentialSubject | CredentialSubjectProperty;
};

type CredentialSubjectProperty = {
	mandatory?: boolean;
	display?: DisplayProperties[];
};

type DisplayProperties = {
	name: string;
	locale: string;
};
