// Reference: https://openid.github.io/OpenID4VCI/openid-4-verifiable-credential-issuance-wg-draft.html#section-10.2.3

export interface CredentialIssuerMetadata {
	credential_issuer: string;
	authorization_servers?: string[];
	credential_endpoint: string;
	batch_credential_endpoint?: string;
	deferred_credential_endpoint?: string;
	display?: DisplayObject[];
	credentials_supported: { [key: string]: CredentialMetadata };
}

export interface CredentialMetadata {
	format: 'jwt_vc_json' | 'ldp_vc' | 'jwt_vc_json-ld'; // https://openid.github.io/OpenID4VCI/openid-4-verifiable-credential-issuance-wg-draft.html#appendix-E.1
	scope?: string;
	cryptographic_binding_methods_supported?: string[];
	cryptographic_suites_supported?: string[];
	proof_types_supported?: string[];
	display?: CredentialMetadataDisplay[];
	credential_definition: CredentialDefinition;
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
