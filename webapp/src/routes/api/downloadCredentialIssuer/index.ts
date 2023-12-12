import type { CredentialIssuerMetadata, CredentialSubject } from '$lib/credentialIssuer/types';
import { z } from 'zod';

export const requestFormSchema = z.object({
	credential_issuer: z.string().url(),
	authorization_server: z.string().url()
});

export const requestBodySchema = requestFormSchema.extend({
	credential_name: z.string(), // Generate from service name
	templates: z.array(z.string()), // List of JSON schemas
	credential_issuer_name: z.string() // Generate from organization name
});

export type RequestBody = z.infer<typeof requestBodySchema>;

export function request(body: RequestBody, fetchFn = fetch) {
	return fetchFn('/api/downloadCredentialIssuer', {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			'content-type': 'application/json'
		}
	});
}

//

type CredentialIssuerMetadataTemplateProps = {
	credential_issuer_url: string;
	credential_issuer_name: string;
	authorization_server: string;
	credential_name: string;
	credentialSubject: CredentialSubject;
};

export function credentialIssuerMetadataTemplate({
	credential_issuer_url,
	credential_issuer_name,
	authorization_server,
	credential_name,
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
