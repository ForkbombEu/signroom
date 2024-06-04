import type {
	AuthorizationServersResponse,
	ServicesResponse,
	TemplatesResponse
} from '$lib/pocketbase/types';
import { pipe, String as S, Array as A, Option as O } from 'effect';
import type { DownloadMicroservicesRequestBody } from '.';
import { addCustomCode, getFoldersToDelete, type WellKnown } from './shared';
import { cleanUrl } from './utils/data';
import _ from 'lodash/fp';
import AdmZip from 'adm-zip';
import { deleteZipFolder, updateZipEntryJson } from './utils/zip';

/* Data setup */

type AuthorizationServerRelatedData = {
	credentials: Array<{
		issuance_flow: ServicesResponse;
		authorization_template: TemplatesResponse;
	}>;
};

function getAuthorizationServerRelatedDataFromRequestBody(
	body: DownloadMicroservicesRequestBody,
	authorization_server: AuthorizationServersResponse
): AuthorizationServerRelatedData {
	return {
		credentials: pipe(
			body.issuance_flows,
			A.filter((issuance_flow) => issuance_flow.authorization_server == authorization_server.id),
			A.map((issuance_flow) => ({
				issuance_flow,
				authorization_template: pipe(
					body.templates,
					A.findFirst((t) => t.id == issuance_flow.authorization_template),
					O.getOrThrow
				)
			}))
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
	const scopes_supported = authorization_server_related_data.credentials.map(
		({ issuance_flow }) => issuance_flow.type_name
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

/* Custom code editing */

function addCredentialsCustomCode(
	zip: AdmZip,
	credential_issuer_related_data: AuthorizationServerRelatedData
) {
	credential_issuer_related_data.credentials.forEach(({ issuance_flow, authorization_template }) =>
		addCustomCode(zip, 'authz_server', issuance_flow.type_name, authorization_template)
	);
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

	const authorization_server_related_data = getAuthorizationServerRelatedDataFromRequestBody(
		request_body,
		authorization_server
	);

	editAuthorizationServerWellKnown(zip, authorization_server, authorization_server_related_data);
	getFoldersToDelete('authz_server').forEach((path) => deleteZipFolder(zip, path));
	addCredentialsCustomCode(zip, authorization_server_related_data);

	return zip;
}
