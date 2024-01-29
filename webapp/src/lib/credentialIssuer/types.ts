// Reference: https://openid.github.io/OpenID4VCI/openid-4-verifiable-credential-issuance-wg-draft.html#section-10.2.3

export interface CredentialIssuerMetadata {
	authorization_endpoint: string;
	authorization_response_iss_parameter_supported: boolean;
	claim_types_supported: string[];
	claims_parameter_supported: boolean;
	code_challenge_methods_supported: string[];
	credential_issuer: string;
	authorization_servers?: string[];
	credential_endpoint: string;
	batch_credential_endpoint?: string;
	deferred_credential_endpoint?: string;
	display?: DisplayObject[];
	credentials_supported: { [key: string]: CredentialMetadata };
	grant_types_supported?: string[];
	id_token_signing_alg_values_supported?: string[];
	jwks_uri?: string;
	pushed_authorization_request_endpoint?: string;
	request_object_signing_alg_values_supported?: string[];
	request_parameter_supported?: boolean;
	request_uri_parameter_supported?: boolean;
	response_modes_supported?: string[];
	response_types_supported?: string[];
	scopes_supported?: string[];
	subject_types_supported?: string[];
	token_endpoint?: string;
	token_endpoint_auth_methods_supported?: string[];
}

export interface CredentialMetadata {
	format: 'jwt_vc_json' | 'ldp_vc' | 'jwt_vc_json-ld' | 'vc+sd-jwt'; // https://openid.github.io/OpenID4VCI/openid-4-verifiable-credential-issuance-wg-draft.html#appendix-A.3.1
	scope?: string;
	id?: string;
	cryptographic_binding_methods_supported?: string[];
	cryptographic_suites_supported?: string[];
	proof_types_supported?: string[];
	display?: CredentialMetadataDisplay[];
	credential_definition: CredentialDefinition;
	order?: string[];
	types?: string[];
}

export interface CredentialDefinition {
	type: string[];
	credentialSubject?: CredentialSubject;
}

export interface CredentialSubject {
	[key: string]: CredentialDefinition | CredentialDefinition[] | CredentialSubjectItem; // https://openid.github.io/OpenID4VCI/openid-4-verifiable-credential-issuance-wg-draft.html#appendix-E.1.1.2-2.1.2.2.1
}

export interface CredentialSubjectItem {
	mandatory?: boolean;
	value_type?: string; // TODO - find the exaustive list
	display?: DisplayObject[];
}

export interface CredentialMetadataDisplay {
	name: string;
	locale?: string;
	description?: string;
	logo?: {
		url?: string;
		alt_text?: string;
	};
	background_color?: string;
	text_color?: string;
}

export interface DisplayObject {
	name?: string;
	locale?: string;
}
