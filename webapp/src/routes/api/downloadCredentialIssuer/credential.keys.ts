import type { ObjectSchema } from '$lib/jsonSchema/types';

type CredentialSubjectItem = {
	display: Array<{ locale: string; name: string }>;
};

type CredentialSubject = {
	[key: string]: CredentialSubjectItem;
};

type CredentialKeysJSONTemplateProps = {
	id: string;
	issuerUrl: string;
	credentialSubject: CredentialSubject;
};

export function template(props: CredentialKeysJSONTemplateProps) {
	const { id, issuerUrl, credentialSubject } = props;

	return {
		supported_selective_disclosure: {
			authorization_endpoint: `${issuerUrl}/authorize`,
			authorization_response_iss_parameter_supported: true,
			claim_types_supported: ['normal'],
			claims_parameter_supported: false,
			code_challenge_methods_supported: ['S256'],
			credential_endpoint: `${issuerUrl}/credentials`,
			credential_issuer: `${issuerUrl}`,
			credentials_supported: [
				{
					credentialSubject,
					cryptographic_binding_methods_supported: ['did:jwk'],
					cryptographic_suites_supported: ['ES256'],
					display: [
						{
							background_color: '#000000',
							locale: 'en-US',
							name: 'IdentityCredential',
							text_color: '#ffffff'
						}
					],
					format: 'vc+sd-jwt',
					id,
					order: [],
					types: ['VerifiableCredential', 'IdentityCredential']
				}
			],
			grant_types_supported: [
				'authorization_code',
				'urn:ietf:params:oauth:grant-type:pre-authorized_code'
			],
			id_token_signing_alg_values_supported: ['ES256'],
			issuer: `${issuerUrl}`,
			jwks_uri: `${issuerUrl}/jwks`,
			pushed_authorization_request_endpoint: `${issuerUrl}/par`,
			request_object_signing_alg_values_supported: ['ES256'],
			request_parameter_supported: true,
			request_uri_parameter_supported: true,
			response_modes_supported: ['query'],
			response_types_supported: ['code'],
			scopes_supported: ['openid', 'IdentityCredential'],
			subject_types_supported: ['public'],
			token_endpoint: `${issuerUrl}/token`,
			token_endpoint_auth_methods_supported: ['none']
		},
		object: {
			age: 42,
			degree: 'math',
			family_name: 'Lippo',
			given_name: 'Mimmo',
			iss: issuerUrl,
			sub: 'user 42'
		},
		id,
		es256_public_key:
			'gyvKONZZiFmTUbQseoJ6KdAYJPyFixv0rMXL2T39sawziR3I49jMp/6ChAupQYqZhYPVC/RtxBI+tUcULh1SCg==',
		keyring: {
			es256: 'XdjAYj+RY95+uyYMI8fR3+fmP5LyQaN54vyTTVKxZyA='
		}
	};
}

export function objectSchemaToCredentialSubject(
	schema: ObjectSchema,
	locale: string = 'en-US'
): CredentialSubject {
	let credentialSubject: CredentialSubject = {};

	for (const [propertyName, property] of Object.entries(schema.properties)) {
		if (property.type != 'object' && property.type != 'array') {
			credentialSubject[propertyName] = {
				display: [{ locale, name: propertyName }]
			} satisfies CredentialSubjectItem;
		} else if (property.type === 'object') {
			credentialSubject = { ...credentialSubject, ...objectSchemaToCredentialSubject(property) };
		} else {
			console.log(`Property not handled:`);
			console.log(JSON.stringify(property, null, 2));
		}
	}
	return credentialSubject;
}
