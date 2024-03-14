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
		updateCredentialKeysJson(zip, body, DEFAULT_LOCALE);
		updateCreateSchemaJson(zip, body.templates);

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
				S.replaceAll('https://issuer1.zenswarm.forkbomb.eu', data.credential_issuer_url),
				S.replace('https://authz-server1.zenswarm.forkbomb.eu', data.authorization_server),
				S.replace('DIDroom_Issuer1', data.credential_issuer_name),
				S.replace('Above_18_example', data.credential_name),
				S.replace('Identity', data.credential_name),

				JSON.parse,
				_.update('credential_configurations_supported', (v: unknown[]) => v.slice(undefined, 1)), // Keeps only the first example
				_.set(
					'credential_configurations_supported[0].credential_definition.credentialSubject',
					mergeObjectSchemasIntoCredentialSubject(data.templates, locale)
				),

				(json) => JSON.stringify(json, null, 4)
			)
	);
}

function updateCredentialKeysJson(zip: AdmZip, data: RequestBody, locale = DEFAULT_LOCALE) {
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
					mergeObjectSchemasIntoCredentialSubject(data.templates, locale)
				),
				_.set(
					'supported_selective_disclosure.credentials_supported[0].display[0].name',
					data.credential_name
				),
				_.set('supported_selective_disclosure.credentials_supported[0].display[0].locale', locale),
				_.set('id', nanoid()),

				(json) => JSON.stringify(json, null, 4)
			)
	);
}

function updateCreateSchemaJson(zip: AdmZip, templates: RequestBody['templates']) {
	updateZipFileContent(
		zip,
		'credential_issuer/create.schema.json',

		() => pipe(templates, mergeObjectSchemas, (data) => JSON.stringify(data, null, 4))
	);
}
