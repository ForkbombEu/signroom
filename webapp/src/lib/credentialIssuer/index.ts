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
		authorization_endpoint: `${credential_issuer_url}/credential_issuer/authorize`,
		authorization_response_iss_parameter_supported: true,
		authorization_servers: [authorization_server],
		batch_credential_endpoint: `${credential_issuer_url}/credential_issuer/batch_credential`, // TODO - Review
		claim_types_supported: ['normal'],
		claims_parameter_supported: false,
		code_challenge_methods_supported: ['S256'],
		credential_endpoint: `${credential_issuer_url}/credential_issuer/credential`, // TODO - Review
		credential_issuer: credential_issuer_url,
		credentials_supported: {
			[credential_name]: {
				format: 'vc+sd-jwt',
				// scope: 'UniversityDegree', // not sure
				cryptographic_binding_methods_supported: ['did:dyne:sandbox.signroom'],
				cryptographic_suites_supported: ['ES256'],
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
		},
		deferred_credential_endpoint: `${credential_issuer_url}/credential_issuer/deferred_credential`,
		grant_types_supported: ['authorization_code'],
		id_token_signing_alg_values_supported: ['ES256'],
		pushed_authorization_request_endpoint: `${credential_issuer_url}/credential_issuer/par`,
		request_object_signing_alg_values_supported: ['ES256'],
		request_parameter_supported: true,
		request_uri_parameter_supported: true,
		response_modes_supported: ['query'],
		response_types_supported: ['code'],
		scopes_supported: ['openid'],
		token_endpoint: `${credential_issuer_url}/credential_issuer/token`,
		token_endpoint_auth_methods_supported: ['none'],
		display: [
			{
				name: credential_issuer_name,
				locale: 'en-US'
			}
		]
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
