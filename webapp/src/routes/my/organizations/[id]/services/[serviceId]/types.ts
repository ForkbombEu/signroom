// Types generated by CHATGPT from
// https://openid.github.io/OpenID4VCI/openid-4-verifiable-credential-issuance-wg-draft.html#section-10.2.3

export interface CredentialIssuerMetadata {
	credential_issuer: string;
	authorization_servers?: string[];
	credential_endpoint: string;
	batch_credential_endpoint?: string;
	deferred_credential_endpoint?: string;
	display?: DisplayObject[];
	credentials_supported: { [key: string]: CredentialDefinition };
}

export interface DisplayObject {
	name: string;
	locale: string;
	logo?: LogoObject;
}

export interface LogoObject {
	url: string;
	alt_text: string;
	background_color?: string;
	text_color?: string;
}

export interface CredentialDefinition {
	format: string;
	scope?: string;
	cryptographic_binding_methods_supported?: string[];
	cryptographic_suites_supported?: string[];
	credential_definition: CredentialSpecificDefinition;
	proof_types_supported?: string[];
	display?: CredentialDisplayObject[];
}

export interface CredentialSpecificDefinition {
	type: string[];
	credentialSubject: CredentialSubject;
}

export interface CredentialSubject {
	[key: string]: CredentialSubjectProperty;
}

export interface CredentialSubjectProperty {
	display?: DisplayObject[];
}

export interface CredentialDisplayObject extends DisplayObject {
	logo?: LogoObject;
	background_color?: string;
	text_color?: string;
}

// Additional specific fields can be added here as needed.