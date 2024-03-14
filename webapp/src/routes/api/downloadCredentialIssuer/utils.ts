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

//

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

//

export function objectSchemaToCredentialSubject(
	schema: ObjectSchema,
	locale: string = 'en-US'
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

type CredentialSubject = {
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
