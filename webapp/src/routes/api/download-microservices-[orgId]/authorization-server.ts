// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import _ from 'lodash/fp';
import AdmZip from 'adm-zip';
import { pipe, String as S, Array as A, Option as O } from 'effect';

import type {
	AuthorizationServersResponse,
	ServicesResponse,
	TemplatesResponse
} from '$lib/pocketbase/types';
import type { ObjectSchema } from '$lib/jsonSchema/types';

import {
	add_credential_custom_code,
	add_microservice_env,
	delete_tests,
	delete_unused_folders,
	formatMicroserviceUrl,
	get_credential_custom_code_path,
	type WellKnown
} from './shared-operations';
import { update_zip_json_entry } from './utils/zip';
import { config } from './config';
import type { DownloadMicroservicesData } from './+server';

/* Main */

export function createAuthorizationServerZip(
	zip_buffer: Buffer,
	authorization_server: AuthorizationServersResponse,
	data: DownloadMicroservicesData
) {
	const zip = new AdmZip(zip_buffer);

	const authorization_server_related_data = get_authorization_server_related_data_from_request_body(
		data,
		authorization_server
	);

	edit_authorization_server_well_known(
		zip,
		authorization_server,
		authorization_server_related_data
	);
	add_credentials_custom_code(zip, authorization_server_related_data);
	add_microservice_env(zip, authorization_server);
	delete_unused_folders(zip, 'authz_server');
	delete_tests(zip);

	return zip;
}

/* Data setup */

type AuthorizationServerRelatedData = {
	credentials: Array<{
		issuance_flow: ServicesResponse;
		authorization_template: TemplatesResponse;
	}>;
};

function get_authorization_server_related_data_from_request_body(
	data: DownloadMicroservicesData,
	authorization_server: AuthorizationServersResponse
): AuthorizationServerRelatedData {
	return {
		credentials: pipe(
			data.issuance_flows,
			A.filter((issuance_flow) => issuance_flow.authorization_server == authorization_server.id),
			A.map((issuance_flow) => ({
				issuance_flow,
				authorization_template: pipe(
					data.templates,
					A.findFirst((t) => t.id == issuance_flow.authorization_template),
					O.getOrThrow
				)
			}))
		)
	};
}

/* Well known editing */

function create_authorization_server_well_known(
	authorization_server: AuthorizationServersResponse,
	authorization_server_related_data: AuthorizationServerRelatedData,
	default_well_known: WellKnown
): WellKnown {
	const authorization_server_url = formatMicroserviceUrl(
		authorization_server.endpoint,
		'authz_server'
	);
	const scopes_supported = authorization_server_related_data.credentials.map(
		({ issuance_flow }) => issuance_flow.type_name
	);

	return pipe(
		default_well_known,
		JSON.stringify,
		S.replaceAll('{{ as_url }}', authorization_server_url),
		JSON.parse,
		_.set('scopes_supported', scopes_supported)
	) as WellKnown;
}

/* Custom code editing */

function add_credentials_custom_code(
	zip: AdmZip,
	credential_issuer_related_data: AuthorizationServerRelatedData
) {
	credential_issuer_related_data.credentials.forEach(
		({ issuance_flow, authorization_template }) => {
			add_credential_custom_code(
				zip,
				'authz_server',
				issuance_flow.type_name,
				authorization_template
			);
			add_authorization_template_schema(zip, issuance_flow.type_name, authorization_template);
		}
	);
}

function add_authorization_template_schema(
	zip: AdmZip,
	credential_type_name: string,
	template: TemplatesResponse
) {
	const basePath = get_credential_custom_code_path(zip, 'authz_server', credential_type_name);
	const schema = template.schema as ObjectSchema;
	zip.addFile(`${basePath}.schema.json`, Buffer.from(JSON.stringify(schema, null, 4)));
}

/* Zip editing */

function edit_authorization_server_well_known(
	zip: AdmZip,
	authorization_server: AuthorizationServersResponse,
	authorization_server_related_data: AuthorizationServerRelatedData
) {
	update_zip_json_entry(zip, get_authorization_server_well_known_path(), (default_well_known) =>
		create_authorization_server_well_known(
			authorization_server,
			authorization_server_related_data,
			default_well_known as WellKnown
		)
	);
}

function get_authorization_server_well_known_path() {
	return [
		config.folder_names.public,
		config.folder_names.microservices.authz_server,
		config.folder_names.well_known,
		config.file_names.well_known.authz_server
	].join('/');
}
