import type { ObjectSchema } from '$lib/jsonSchema/types';
import { z } from 'zod';
import { DEFAULT_LOCALE } from './locale';
import _ from 'lodash';

//

export function mergeObjectSchemas(schemas: ObjectSchema[]): ObjectSchema {
	return {
		type: 'object',
		properties: _.merge({}, ...schemas.map((s) => s.properties)),
		required: _.concat(...schemas.map((s) => s.required ?? []))
	};
}

export function mergeObjectSchemasIntoCredentialSubject(
	schemas: ObjectSchema[],
	locale = DEFAULT_LOCALE
): CredentialSubject {
	const subjects = schemas.map((s) => objectSchemaToCredentialSubject(s, locale));
	return _.merge({}, ...subjects);
}

/* JSON Schema to CredentialSubject conversion */

export function objectSchemaToCredentialSubject(
	schema: ObjectSchema,
	locale = DEFAULT_LOCALE
): CredentialSubject {
	const credentialSubject: CredentialSubject = {};

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
			credentialSubject[propertyName] = objectSchemaToCredentialSubject(property, locale);
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

const DisplayPropertiesSchema = z.object({
	name: z.string(),
	locale: z.string()
});

type DisplayProperties = {
	name: string;
	locale: string;
};

const CredentialSubjectPropertySchema = z.object({
	mandatory: z.boolean(),
	display: z.array(DisplayPropertiesSchema).optional()
});

export type CredentialSubjectProperty = {
	mandatory?: boolean;
	display?: DisplayProperties[];
	// TODO - Handle "type" property if necessary
};

//

function checkCredentialSubjectProperty(data: unknown): data is CredentialSubjectProperty {
	return CredentialSubjectPropertySchema.safeParse(data).success;
}

export function flattenCredentialSubjectProperties(
	credentialSubject: CredentialSubject
): [string, CredentialSubjectProperty][] {
	let propertyList: [string, CredentialSubjectProperty][] = [];

	Object.entries(credentialSubject).forEach(([propertyName, property]) => {
		if (checkCredentialSubjectProperty(property)) {
			propertyList.push([propertyName, property]);
		}
		//
		else {
			const nestedProperties = flattenCredentialSubjectProperties(property).map(
				([nestedPropertyName, nestedProperty]) =>
					[`${propertyName}.${nestedPropertyName}`, nestedProperty] as [
						string,
						CredentialSubjectProperty
					]
			);
			propertyList = [...propertyList, ...nestedProperties];
		}
	});

	return propertyList;
}
