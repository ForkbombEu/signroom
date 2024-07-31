// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import AdmZip from 'adm-zip';
import { pipe, Option as O, Array as A, String as S } from 'effect';
import _ from 'lodash/fp';

import type {
	AuthorizationServersResponse,
	IssuersResponse,
	ServicesResponse,
	TemplatesResponse
} from '$lib/pocketbase/types';
import type { ObjectSchema } from '$lib/jsonSchema/types';
import type { DownloadMicroservicesRequestBody } from '.';

import {
	add_credential_custom_code,
	add_microservice_env,
	delete_unused_folders,
	type WellKnown
} from './shared-operations';
import {
	get_credential_configuration_template,
	objectSchemaToCredentialSubject
} from './utils/credential-subject';
import { update_zip_json_entry } from './utils/zip';
import { cleanUrl } from './utils/strings';
import { DEFAULT_LOCALE } from './utils/locale';
import { config } from './config';

/* Main */

export function create_credential_issuer_zip(
	didroom_microservices_zip_buffer: Buffer,
	credential_issuer: IssuersResponse,
	request_body: DownloadMicroservicesRequestBody
) {
	const zip = new AdmZip(didroom_microservices_zip_buffer);

	const credential_issuer_related_data = get_credential_issuer_related_data_from_request_body(
		credential_issuer,
		request_body
	);

	edit_credential_issuer_well_known(zip, credential_issuer, credential_issuer_related_data);
	add_credentials_custom_code(zip, credential_issuer_related_data);
	delete_unused_folders(zip, 'credential_issuer');
	add_microservice_env(zip, credential_issuer);

	return zip;
}

/* Get related data */

type CredentialIssuerRelatedData = {
	authorization_servers: Array<AuthorizationServersResponse>;
	issuance_flows: Array<IssuanceFlow>;
};

type IssuanceFlow = ServicesResponse & { template: TemplatesResponse };

function get_credential_issuer_related_data_from_request_body(
	credential_issuer: IssuersResponse,
	body: DownloadMicroservicesRequestBody
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

		issuance_flows: pipe(
			org_issuance_flows,
			A.filter((issuance_flow) => issuance_flow.credential_issuer == credential_issuer.id),
			A.map((issuance_flow) => ({
				...issuance_flow,
				template: pipe(
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

function create_credential_issuer_well_known(
	credential_issuer: IssuersResponse,
	credential_issuer_related_data: CredentialIssuerRelatedData,
	default_well_known: WellKnown
): WellKnown {
	const { authorization_servers, issuance_flows } = credential_issuer_related_data;

	const credential_issuer_url = cleanUrl(credential_issuer.endpoint);
	const authorization_servers_urls = authorization_servers.map((a) => a.endpoint).map(cleanUrl);

	return pipe(
		default_well_known,

		JSON.stringify,
		S.replaceAll('{{ ci_url }}', credential_issuer_url),
		JSON.parse,

		_.set('authorization_servers', authorization_servers_urls),
		_.set('display[0]', {
			name: credential_issuer.name,
			locale: DEFAULT_LOCALE
		}),

		_.set(
			'credential_configurations_supported',
			issuance_flows.map(convert_issuance_flow_data_to_credential_configuration)
		)
	) as WellKnown;
}

function convert_issuance_flow_data_to_credential_configuration(
	issuance_flow: IssuanceFlow
): CredentialConfiguration {
	return pipe(
		get_credential_configuration_template(),

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
			objectSchemaToCredentialSubject(issuance_flow.template.schema as ObjectSchema, DEFAULT_LOCALE)
		)
	) as CredentialConfiguration;
}

/* Custom code editing */

function add_credentials_custom_code(
	zip: AdmZip,
	credential_issuer_related_data: CredentialIssuerRelatedData
) {
	pipe(
		credential_issuer_related_data.issuance_flows,
		A.forEach((issuance_flow) =>
			add_credential_custom_code(
				zip,
				'credential_issuer',
				issuance_flow.type_name,
				issuance_flow.template
			)
		)
	);
}

/* Zip editing */

const CREDENTIAL_ISSUER_WELL_KNOWN_PATH =
	'public/credential_issuer/.well-known/openid-credential-issuer';

function edit_credential_issuer_well_known(
	zip: AdmZip,
	credential_issuer: IssuersResponse,
	credential_issuer_related_data: CredentialIssuerRelatedData
) {
	update_zip_json_entry(
		zip,
		CREDENTIAL_ISSUER_WELL_KNOWN_PATH,
		(default_well_known) =>
			create_credential_issuer_well_known(
				credential_issuer,
				credential_issuer_related_data,
				default_well_known as WellKnown
			),
		config.json.tab_size
	);
}
