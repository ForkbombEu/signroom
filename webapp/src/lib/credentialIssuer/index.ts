import type { ObjectSchema } from '$lib/jsonSchema/types';
import type { TemplatesResponse } from '$lib/pocketbase/types';
import type { CredentialMetadata, CredentialSubject, CredentialSubjectItem } from './types';

export function objectSchemaToCredentialSubject(
	schema: ObjectSchema,
	type: string[] = []
): CredentialSubject {
	const credentialSubject: CredentialSubject = {};
	for (const [propertyName, property] of Object.entries(schema.properties)) {
		if (property.type != 'object' && property.type != 'array') {
			credentialSubject[propertyName] = {
				mandatory: Boolean(schema.required?.includes(propertyName))
			} satisfies CredentialSubjectItem;
		} else if (property.type === 'object') {
			credentialSubject[propertyName] = objectSchemaToCredentialSubject(property, type);
		} else {
			console.log(`Property not handled: ${propertyName}`);
		}
	}
	return credentialSubject;
}

export function templateToCredentialMetadata(template: TemplatesResponse): CredentialMetadata {
	return {
		format: 'jwt_vc_json',
		credential_definition: {
			type: [],
			credentialSubject: objectSchemaToCredentialSubject(JSON.parse(template.schema))
		}
	};
}
