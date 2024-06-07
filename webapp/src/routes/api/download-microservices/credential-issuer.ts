import AdmZip from 'adm-zip';
import { deleteZipFolder, updateZipEntryJson } from './utils/zip';
import type {
	AuthorizationServersResponse,
	IssuersResponse,
	ServicesResponse,
	TemplatesResponse
} from '$lib/pocketbase/types';
import type { DownloadMicroservicesRequestBody } from '.';
import { cleanUrl } from './utils/data';
import { addCustomCode, getFoldersToDelete, type WellKnown } from './shared';
import { DEFAULT_LOCALE } from './utils/locale';
import { objectSchemaToCredentialSubject } from './utils/credential-subject';
import type { ObjectSchema } from '$lib/jsonSchema/types';
import _ from 'lodash/fp';

import { pipe } from 'effect';
import * as S from 'effect/String';
import * as A from 'effect/Array';
import * as O from 'effect/Option';

/* Data setup */

type CredentialIssuerRelatedData = {
	authorization_servers: Array<AuthorizationServersResponse>;
	credentials: Array<{
		issuance_flow: ServicesResponse;
		issuance_template: TemplatesResponse;
	}>;
};

function getCredentialIssuerRelatedDataFromRequestBody(
	body: DownloadMicroservicesRequestBody,
	credential_issuer: IssuersResponse
): CredentialIssuerRelatedData {
	const {
		authorization_servers: org_authorization_servers,
		issuance_flows: org_issuance_flows,
		templates: org_templates
	} = body;

	return {
		authorization_servers: pipe(
			org_issuance_flows,
			A.filter((issuance_flow) => issuance_flow.credential_issuer == credential_issuer.id),
			A.map((issuance_flow) => issuance_flow.authorization_server),
			(authorization_server_ids) =>
				org_authorization_servers.filter((a) => authorization_server_ids.includes(a.id))
		),

		credentials: pipe(
			org_issuance_flows,
			A.filter((issuance_flow) => issuance_flow.credential_issuer == credential_issuer.id),
			A.map((issuance_flow) => ({
				issuance_flow,
				issuance_template: pipe(
					org_templates,
					A.findFirst((t) => t.id == issuance_flow.credential_template),
					O.getOrThrow
				)
			}))
		)
	};
}

/* Well known editing */

type CredentialConfiguration = Record<string, unknown> & { readonly brand: unique symbol };

function createCredentialIssuerWellKnown(
	credential_issuer: IssuersResponse,
	credential_issuer_related_data: CredentialIssuerRelatedData,
	default_well_known: WellKnown
): WellKnown {
	const { authorization_servers } = credential_issuer_related_data;

	const credential_issuer_url = cleanUrl(credential_issuer.endpoint);
	const authorization_servers_urls = authorization_servers.map((a) => a.endpoint).map(cleanUrl);
	const credential_configuration_sample = getCredentialConfigurationSample(default_well_known);

	return pipe(
		default_well_known,

		JSON.stringify,
		S.replaceAll('https://issuer1.zenswarm.forkbomb.eu/credential_issuer', credential_issuer_url),
		JSON.parse,

		_.set('authorization_servers', authorization_servers_urls),
		_.set('display[0]', {
			name: credential_issuer.name,
			locale: DEFAULT_LOCALE
		}),
		_.set('jwks.keys[0].kid', ''),
		_.set(
			'credential_configurations_supported',
			convertIssuerRelatedDataToCredentialConfigurationsSupported(
				credential_issuer_related_data,
				credential_configuration_sample
			)
		)
	) as WellKnown;
}

function getCredentialConfigurationSample(default_well_known: WellKnown): CredentialConfiguration {
	return pipe(
		default_well_known,
		_.get('credential_configurations_supported[0]')
	) as CredentialConfiguration;
}

function convertIssuerRelatedDataToCredentialConfigurationsSupported(
	data: CredentialIssuerRelatedData,
	credential_configuration_sample: CredentialConfiguration
): CredentialConfiguration[] {
	return data.credentials.map(({ issuance_flow, issuance_template }) =>
		convertIssuanceFlowToCredentialConfiguration(
			issuance_flow,
			issuance_template,
			credential_configuration_sample
		)
	);
}

function convertIssuanceFlowToCredentialConfiguration(
	issuance_flow: ServicesResponse,
	issuance_template: TemplatesResponse,
	credential_configuration_sample: CredentialConfiguration
): CredentialConfiguration {
	return pipe(
		credential_configuration_sample,

		_.set('display[0]', {
			name: issuance_flow.display_name,
			locale: DEFAULT_LOCALE,
			logo: {
				url: issuance_flow.logo,
				alt_text: `${issuance_flow.display_name} logo`
			},
			background_color: '#12107c',
			text_color: '#FFFFFF',
			description: issuance_flow.description
		}),

		_.set('credential_definition.type[0]', issuance_flow.type_name),

		_.set(
			'credential_definition.credentialSubject',
			objectSchemaToCredentialSubject(issuance_template.schema as ObjectSchema, DEFAULT_LOCALE)
		)
	) as CredentialConfiguration;
}

/* Custom code editing */

function addCredentialsCustomCode(
	zip: AdmZip,
	credential_issuer_related_data: CredentialIssuerRelatedData
) {
	credential_issuer_related_data.credentials.forEach(({ issuance_flow, issuance_template }) =>
		addCustomCode(zip, 'credential_issuer', issuance_flow.type_name, issuance_template)
	);
}

/* Zip editing */

const CREDENTIAL_ISSUER_WELL_KNOWN_PATH =
	'public/credential_issuer/.well-known/openid-credential-issuer';

function editCredentialIssuerWellKnown(
	zip: AdmZip,
	credential_issuer: IssuersResponse,
	credential_issuer_related_data: CredentialIssuerRelatedData
) {
	updateZipEntryJson(zip, CREDENTIAL_ISSUER_WELL_KNOWN_PATH, (default_well_known) =>
		createCredentialIssuerWellKnown(
			credential_issuer,
			credential_issuer_related_data,
			default_well_known as WellKnown
		)
	);
}

export function createCredentialIssuerZip(
	zip_buffer: Buffer,
	credential_issuer: IssuersResponse,
	request_body: DownloadMicroservicesRequestBody
) {
	const zip = new AdmZip(zip_buffer);

	const credential_issuer_related_data = getCredentialIssuerRelatedDataFromRequestBody(
		request_body,
		credential_issuer
	);

	editCredentialIssuerWellKnown(zip, credential_issuer, credential_issuer_related_data);
	getFoldersToDelete('credential_issuer').forEach((path) => deleteZipFolder(zip, path));
	addCredentialsCustomCode(zip, credential_issuer_related_data);

	return zip;
}

/* Old code */

// //

// function updateCredentialKeysJson(
// 	zip: AdmZip,
// 	data: RequestBody,
// 	id: string,
// 	locale = DEFAULT_LOCALE
// ) {
// 	const credentialSubject = mergeObjectSchemasIntoCredentialSubject(
// 		[data.credential_template],
// 		locale
// 	);

// 	updateZipFileContent(
// 		zip,
// 		'credential_issuer/credential.keys.json',

// 		(content) =>
// 			pipe(
// 				content,
// 				S.replaceAll('http://issuer.example.org', cleanUrl(data.credential_issuer_url)),

// 				JSON.parse,
// 				_.set(
// 					'supported_selective_disclosure.credentials_supported[0].credentialSubject',
// 					credentialSubject
// 				),
// 				_.set(
// 					'supported_selective_disclosure.credentials_supported[0].display[0].name',
// 					data.credential_display_name
// 				),
// 				_.set('supported_selective_disclosure.credentials_supported[0].display[0].locale', locale),
// 				_.set('supported_selective_disclosure.credentials_supported[0].id', id),
// 				_.set(
// 					'supported_selective_disclosure.credentials_supported[0].order',
// 					Object.keys(credentialSubject)
// 				),
// 				_.set(
// 					'supported_selective_disclosure.credentials_supported[0].types[1]',
// 					data.credential_type_name
// 				),
// 				_.set('supported_selective_disclosure.scopes_supported[1]', data.credential_type_name),
// 				_.set('object', {}),
// 				_.set('id', id),

// 				(json) => JSON.stringify(json, null, 4)
// 			)
// 	);
// }
