import type { RequestHandler } from '@sveltejs/kit';
import AdmZip from 'adm-zip';
import * as credentialIssuer from '$lib/credentialIssuer';
import * as credentialKeys from './credential.keys';
import _ from 'lodash';
import { requestBodySchema, type RequestBody } from '.';
import {
	editZipEntry,
	getZipEntry,
	mergeObjectSchemas,
	objectSchemaToCredentialSubject,
	type CredentialSubject
} from './utils';

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

		/* Credential subject */

		const credentialSubject: CredentialSubject = _.merge(
			templates.map((t) => objectSchemaToCredentialSubject(t))
		);

		/* Credential issuer metadata update */

		const CREDENTIAL_ISSUER_METADATA_FILE_NAME = 'openid-credential-issuer';

		const credentialIssuerMetadataEntry = getZipEntry(zip, CREDENTIAL_ISSUER_METADATA_FILE_NAME);
		if (!credentialIssuerMetadataEntry) throw new Error('Credential Issuer .well-known not found');

		const credentialIssuerMetadata = credentialIssuer.template({
			credential_issuer_url,
			credential_issuer_name,
			credential_name,
			authorization_server,
			credentialSubject
		});

		editZipEntry(
			zip,
			credentialIssuerMetadataEntry,
			JSON.stringify(credentialIssuerMetadata, null, 4)
		);

		/* credential.keys.json */

		const CREDENTIAL_KEYS_FILE_NAME = 'credential.keys.json';

		const credentialKeysJsonEntry = getZipEntry(zip, CREDENTIAL_KEYS_FILE_NAME);
		if (!credentialKeysJsonEntry) throw new Error(`${CREDENTIAL_KEYS_FILE_NAME} not found`);

		const template = credentialKeys.template({
			id: 'sadkjhaskjldh',
			issuerUrl: credential_issuer_url,
			credentialSubject
		});

		editZipEntry(zip, credentialKeysJsonEntry, JSON.stringify(template, null, 4));

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
