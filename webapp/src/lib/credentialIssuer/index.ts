import type { ObjectSchema } from '$lib/jsonSchema/types';
import type { CredentialSubject, CredentialSubjectItem } from './types';

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
