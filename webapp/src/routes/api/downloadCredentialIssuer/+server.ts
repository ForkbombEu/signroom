import type { RequestHandler } from '@sveltejs/kit';
import AdmZip from 'adm-zip';
import type { RequestBody } from '.';
import path from 'node:path';
import * as credentialIssuer from '$lib/credentialIssuer';
import * as credentialKeys from './credential.keys';
import { merge } from 'lodash';
import type { ObjectSchema } from '$lib/jsonSchema/types';
import { nanoid } from 'nanoid';

//

const DIDROOM_MICROSERVICES_URL =
	'https://github.com/ForkbombEu/DIDroom_microservices/archive/refs/heads/main.zip';

//

export const POST: RequestHandler = async ({ fetch, request }) => {
	try {
		const body = (await request.json()) as RequestBody;
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

		/* Credential issuer metadata update */

		const CREDENTIAL_ISSUER_METADATA_FILE_NAME = 'openid-credential-issuer';
		const credentialIssuerMetadataEntry = getFile(zip, CREDENTIAL_ISSUER_METADATA_FILE_NAME);

		if (credentialIssuerMetadataEntry) {
			const credentialSubject = merge(
				templates
					.map((t) => JSON.parse(t))
					.map((t) => credentialIssuer.objectSchemaToCredentialSubject(t))
			);

			const credentialIssuerMetadata = credentialIssuer.template({
				credential_issuer_url,
				credential_issuer_name,
				credential_name,
				authorization_server,
				credentialSubject
			});

			editFile(
				zip,
				CREDENTIAL_ISSUER_METADATA_FILE_NAME,
				JSON.stringify(credentialIssuerMetadata, null, 4)
			);
		}

		/* credential.keys.json */

		const CREDENTIAL_KEYS_FILE_NAME = 'credential.keys.json';
		const credentialKeysJsonEntry = getFile(zip, CREDENTIAL_KEYS_FILE_NAME);

		if (credentialKeysJsonEntry) {
			const credentialSubject = merge(
				templates
					.map((t) => JSON.parse(t))
					.map((t) => credentialKeys.objectSchemaToCredentialSubject(t))
			);

			const template = credentialKeys.template({
				id: 'sadkjhaskjldh',
				issuerUrl: credential_issuer_url,
				credentialSubject
			});

			editFile(zip, CREDENTIAL_KEYS_FILE_NAME, JSON.stringify(template, null, 4));
		}

		/* create.schema.json */

		const CREATE_SCHEMA_JSON_FILE_NAME = 'create.schema.json';
		const createSchemaJsonEntry = getFile(zip, CREATE_SCHEMA_JSON_FILE_NAME);

		if (createSchemaJsonEntry) {
			const schema = mergeObjectSchemas(templates.map((t) => JSON.parse(t)));
			editFile(zip, CREATE_SCHEMA_JSON_FILE_NAME, JSON.stringify(schema, null, 2));
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

function getFile(zip: AdmZip, entryName: string) {
	return zip.getEntries().find((entry) => entry.name === entryName);
}

function editFile(zip: AdmZip, entryName: string, content: string) {
	const entry = zip.getEntries().find((entry) => entry.name === entryName);
	if (!entry) return;
	zip.updateFile(entry, Buffer.from(content));
}

function mergeObjectSchemas(schemas: ObjectSchema[]): ObjectSchema {
	if (schemas.length === 1) return schemas[0];

	const mergedSchema: ObjectSchema = { type: 'object', properties: {}, required: [] };
	for (const schema of schemas) {
		const id = nanoid(5);
		mergedSchema.properties[id] = schema;
		mergedSchema.required?.push(id);
	}
	return mergedSchema;
}
