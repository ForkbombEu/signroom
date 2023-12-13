import type { ObjectSchema } from '$lib/jsonSchema/types';
import type { CredentialSubject, CredentialSubjectItem, CredentialIssuerMetadata } from './types';

//

type CredentialIssuerMetadataTemplateProps = {
	credential_issuer_url: string;
	credential_issuer_name: string;
	credential_name: string;
	authorization_server: string;
	credentialSubject: CredentialSubject;
};

export function credentialIssuerMetadataTemplate({
	credential_issuer_url,
	credential_issuer_name,
	credential_name,
	authorization_server,
	credentialSubject
}: CredentialIssuerMetadataTemplateProps): CredentialIssuerMetadata {
	return {
		credential_issuer: credential_issuer_url,
		authorization_servers: [authorization_server],
		credential_endpoint: `${credential_issuer_url}`, // TODO - Review
		batch_credential_endpoint: `${credential_issuer_url}/batch_credential`, // TODO - Review
		deferred_credential_endpoint: `${credential_issuer_url}/deferred_credential`, // TODO - Review
		display: [
			{
				name: credential_issuer_name,
				locale: 'en-US'
			}
		],
		credentials_supported: {
			[credential_name]: {
				format: 'jwt_vc_json',
				// scope: 'UniversityDegree', // not sure
				cryptographic_binding_methods_supported: ['did:dyne:sandbox.signroom'],
				cryptographic_suites_supported: ['ES256K'],
				proof_types_supported: ['jwt'],
				credential_definition: {
					type: [credential_name],
					credentialSubject
				}
				// display: [
				// 	{
				// 		name: 'University Credential',
				// 		locale: 'en-US',
				// 		logo: {
				// 			url: 'https://exampleuniversity.com/public/logo.png',
				// 			alt_text: 'a square logo of a university'
				// 		},
				// 		background_color: '#12107c',
				// 		text_color: '#FFFFFF'
				// 	}
				// ]
			}
		}
	};
}

//

export function objectSchemaToCredentialSubject(schema: ObjectSchema): CredentialSubject {
	const credentialSubject: CredentialSubject = {};
	for (const [propertyName, property] of Object.entries(schema.properties)) {
		if (property.type != 'object' && property.type != 'array') {
			credentialSubject[propertyName] = {
				mandatory: Boolean(schema.required?.includes(propertyName))
			} satisfies CredentialSubjectItem;
		} else if (property.type === 'object') {
			credentialSubject[propertyName] = objectSchemaToCredentialSubject(property);
		} else {
			console.log(`Property not handled:`);
			console.log(JSON.stringify(property, null, 2));
		}
	}
	return credentialSubject;
}
