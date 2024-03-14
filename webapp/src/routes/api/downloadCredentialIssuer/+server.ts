import { String as S, pipe } from 'effect';
import _ from 'lodash';
import _fp from 'lodash/fp';

import type { RequestHandler } from '@sveltejs/kit';
import AdmZip from 'adm-zip';
import * as credentialKeys from './credential.keys';
import { requestBodySchema, type RequestBody } from '.';
import {
	editZipEntry,
	getZipEntry,
	mergeObjectSchemas,
	DEFAULT_LOCALE,
	mergeObjectSchemasIntoCredentialSubject,
	updateZipFileContent
} from './utils';
import { nanoid } from 'nanoid';

//

const DIDROOM_MICROSERVICES_URL =
	'https://github.com/ForkbombEu/DIDroom_microservices/archive/refs/heads/main.zip';

//

export const POST: RequestHandler = async ({ fetch, request }) => {
	try {
		const body = requestBodySchema.parse(await request.json());

		const {
			credential_issuer_url,
			credential_issuer_name,
			credential_name,
			authorization_server,
			templates
		} = body;

		/* Zip reading */

		const zipResponse = await fetch(DIDROOM_MICROSERVICES_URL);
		const buffer = Buffer.from(await zipResponse.arrayBuffer());
		const zip = new AdmZip(buffer);

		/* Transforming files */

		updateCredentialIssuerWellKnown(zip, body, DEFAULT_LOCALE);
		updateCredentialKeysJson(zip, body, DEFAULT_LOCALE);

		/* create.schema.json */

		const CREATE_SCHEMA_JSON_FILE_NAME = 'create.schema.json';
		const createSchemaJsonEntry = getZipEntry(zip, CREATE_SCHEMA_JSON_FILE_NAME);

		if (createSchemaJsonEntry) {
			const schema = mergeObjectSchemas(templates);
			editZipEntry(zip, createSchemaJsonEntry, JSON.stringify(schema, null, 2));
		}

		/* */

		return new Response(zip.toBuffer(), {
			status: 200,
			headers: {
				'Content-Type': 'application/octet-stream'
			}
		});
	} catch (e) {
		console.log(e);
		return new Response((e as Error)?.message ?? 'Internal Server Error', {
			status: 500
		});
	}
};

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

				_fp.update('credential_configurations_supported', (v: unknown[]) => v.slice(undefined, 1)),
				// Keeps only the first example

				_fp.set(
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

				_fp.set(
					'supported_selective_disclosure.credentials_supported[0].credentialSubject',
					mergeObjectSchemasIntoCredentialSubject(data.templates, locale)
				),

				_fp.set(
					'supported_selective_disclosure.credentials_supported[0].display[0].name',
					data.credential_name
				),

				_fp.set(
					'supported_selective_disclosure.credentials_supported[0].display[0].locale',
					locale
				),

				_fp.set('id', nanoid()),

				(json) => JSON.stringify(json, null, 4)
			)
	);
}
