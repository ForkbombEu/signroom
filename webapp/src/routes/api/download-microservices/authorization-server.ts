import type { AuthorizationServersResponse, ServicesResponse } from '$lib/pocketbase/types';
import { pipe, String as S } from 'effect';
import type { DownloadMicroservicesRequestBody } from '.';
import { getFoldersToDelete, type WellKnown } from './shared';
import { cleanUrl } from './utils/data';
import _ from 'lodash/fp';
import AdmZip from 'adm-zip';
import { deleteZipFolder, updateZipEntryJson } from './utils/zip';

/* Data setup */

type AuthorizationServerRelatedData = {
	issuance_flows: ServicesResponse[];
};

function getAuthorizationServerRelatedDataFromRequestBody(
	body: DownloadMicroservicesRequestBody,
	authorization_server: AuthorizationServersResponse
): AuthorizationServerRelatedData {
	return {
		issuance_flows: body.issuance_flows.filter(
			(flow) => flow.authorization_server == authorization_server.id
		)
	};
}

/* Well known editing */

function createAuthorizationServerWellKnown(
	authorization_server: AuthorizationServersResponse,
	authorization_server_related_data: AuthorizationServerRelatedData,
	default_well_known: WellKnown
): WellKnown {
	const authorization_server_url = cleanUrl(authorization_server.endpoint);
	const scopes_supported = authorization_server_related_data.issuance_flows.map(
		(flow) => flow.type_name
	);

	return pipe(
		default_well_known,

		JSON.stringify,
		S.replaceAll(
			'https://authz-server1.zenswarm.forkbomb.eu/authz_server',
			authorization_server_url
		),
		JSON.parse,

		_.set('jwks.keys[0].kid', ''),
		_.set('scopes_supported', scopes_supported)
	) as WellKnown;
}

/* Zip editing */

const AUTHORIZATION_SERVER_WELL_KNOWN_PATH =
	'public/authz_server/.well-known/oauth-authorization-server';

function editAuthorizationServerWellKnown(
	zip: AdmZip,
	authorization_server: AuthorizationServersResponse,
	authorization_server_related_data: AuthorizationServerRelatedData
) {
	updateZipEntryJson(zip, AUTHORIZATION_SERVER_WELL_KNOWN_PATH, (default_well_known) =>
		createAuthorizationServerWellKnown(
			authorization_server,
			authorization_server_related_data,
			default_well_known as WellKnown
		)
	);
}

export function createAuthorizationServerZip(
	zip_buffer: Buffer,
	authorization_server: AuthorizationServersResponse,
	request_body: DownloadMicroservicesRequestBody
) {
	const zip = new AdmZip(zip_buffer);

	const credential_issuer_related_data = getAuthorizationServerRelatedDataFromRequestBody(
		request_body,
		authorization_server
	);

	editAuthorizationServerWellKnown(zip, authorization_server, credential_issuer_related_data);
	getFoldersToDelete('authz_server').forEach((path) => deleteZipFolder(zip, path));

	return zip;
}
