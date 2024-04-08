import { String as S, pipe } from 'effect';
import _ from 'lodash/fp';

import type { RequestHandler } from '@sveltejs/kit';
import AdmZip from 'adm-zip';
import { requestBodySchema, type RequestBody } from '.';
import {
	mergeObjectSchemas,
	DEFAULT_LOCALE,
	mergeObjectSchemasIntoCredentialSubject,
	updateZipFileContent
} from './utils';
import { nanoid } from 'nanoid';

//

export const POST: RequestHandler = async ({ fetch, request }) => {
	try {
		const body = await parseRequestBody(request);
		const zip = await fetchZipFile(fetch);

		updateCredentialIssuerWellKnown(zip, body, DEFAULT_LOCALE);
		updateAuthorizationServerWellKnown(zip, body, DEFAULT_LOCALE);
		updateCredentialKeysJson(zip, body, nanoid(), DEFAULT_LOCALE);
		updateCreateSchemaJson(zip, body.credential_template);

		return zipResponse(zip);
	} catch (e) {
		console.log(e);
		return errorResponse(e);
	}
};

//

async function parseRequestBody(request: Request): Promise<RequestBody> {
	return requestBodySchema.parse(await request.json());
}

async function fetchZipFile(fetchFn = fetch): Promise<AdmZip> {
	const DIDROOM_MICROSERVICES_URL =
		'https://github.com/ForkbombEu/DIDroom_microservices/archive/refs/heads/main.zip';
	const zipResponse = await fetchFn(DIDROOM_MICROSERVICES_URL);
	const buffer = Buffer.from(await zipResponse.arrayBuffer());
	return new AdmZip(buffer);
}

function zipResponse(zip: AdmZip): Response {
	return new Response(zip.toBuffer(), {
		status: 200,
		headers: {
			'Content-Type': 'application/octet-stream'
		}
	});
}

function errorResponse(e: unknown) {
	return new Response(e instanceof Error ? e.message : 'Internal Server Error', {
		status: 500
	});
}

//

function updateCredentialIssuerWellKnown(zip: AdmZip, data: RequestBody, locale = DEFAULT_LOCALE) {
	updateZipFileContent(
		zip,
		'public/credential_issuer/.well-known/openid-credential-issuer',

		(content) =>
			pipe(
				content,

				S.replaceAll(
					'https://issuer1.zenswarm.forkbomb.eu/credential_issuer',
					data.credential_issuer_url
				),
				S.replace(
					'https://authz-server1.zenswarm.forkbomb.eu/authz_server',
					data.authorization_server_url
				),

				JSON.parse,

				_.set('display[0].name', {
					name: data.organization_name,
					locale
				}),

				_.set('credential_configurations_supported[0].display[0]', {
					name: data.credential_display_name,
					locale,
					logo: {
						url: data.credential_logo,
						alt_text: `${data.credential_display_name} logo`
					},
					background_color: '#12107c',
					text_color: '#FFFFFF',
					description: data.credential_description
				}),

				_.set(
					'credential_configurations_supported[0].credential_definition.type[0]',
					data.credential_type_name
				),
				_.set(
					'credential_configurations_supported[0].credential_definition.credentialSubject',
					mergeObjectSchemasIntoCredentialSubject([data.credential_template], locale)
				),
				_.update('credential_configurations_supported', (v: unknown[]) => v.slice(undefined, 1)), // Keeps only the first example

				(json) => JSON.stringify(json, null, 4)
			)
	);
}

function updateAuthorizationServerWellKnown(
	zip: AdmZip,
	data: RequestBody,
	locale = DEFAULT_LOCALE
) {
	updateZipFileContent(
		zip,
		'public/authz_server/.well-known/oauth-authorization-server',

		(content) =>
			pipe(
				content,

				S.replaceAll(
					'https://authz-server1.zenswarm.forkbomb.eu/authz_server',
					data.authorization_server_url
				),

				JSON.parse,

				_.set('issuer', data.credential_issuer_url),
				_.set('scopes_supported', [data.credential_type_name]),

				(json) => JSON.stringify(json, null, 4)
			)
	);
}

function updateCredentialKeysJson(
	zip: AdmZip,
	data: RequestBody,
	id: string,
	locale = DEFAULT_LOCALE
) {
	const credentialSubject = mergeObjectSchemasIntoCredentialSubject(
		[data.credential_template],
		locale
	);

	updateZipFileContent(
		zip,
		'credential_issuer/credential.keys.json',

		(content) =>
			pipe(
				content,
				S.replaceAll('http://issuer.example.org', data.credential_issuer_url),

				JSON.parse,
				_.set(
					'supported_selective_disclosure.credentials_supported[0].credentialSubject',
					credentialSubject
				),
				_.set(
					'supported_selective_disclosure.credentials_supported[0].display[0].name',
					data.credential_display_name
				),
				_.set('supported_selective_disclosure.credentials_supported[0].display[0].locale', locale),
				_.set('supported_selective_disclosure.credentials_supported[0].id', id),
				_.set(
					'supported_selective_disclosure.credentials_supported[0].order',
					Object.keys(credentialSubject)
				),
				_.set(
					'supported_selective_disclosure.credentials_supported[0].types[1]',
					data.credential_type_name
				),
				_.set('supported_selective_disclosure.scopes_supported[1]', data.credential_type_name),
				_.set('object', {}),
				_.set('id', id),

				(json) => JSON.stringify(json, null, 4)
			)
	);
}

function updateCreateSchemaJson(zip: AdmZip, template: RequestBody['credential_template']) {
	updateZipFileContent(
		zip,
		'credential_issuer/create.schema.json',

		() => pipe([template], mergeObjectSchemas, (data) => JSON.stringify(data, null, 4))
	);
}
