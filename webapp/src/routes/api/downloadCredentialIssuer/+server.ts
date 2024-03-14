import type { RequestHandler } from '@sveltejs/kit';
import AdmZip from 'adm-zip';
import * as credentialIssuer from '$lib/credentialIssuer';
import * as credentialKeys from './credential.keys';
import _ from 'lodash';
import type { ObjectSchema } from '$lib/jsonSchema/types';
import { nanoid } from 'nanoid';
import { requestBodySchema } from '.';

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

		/* Credential issuer metadata update */

		const CREDENTIAL_ISSUER_METADATA_FILE_NAME = 'openid-credential-issuer';

		const credentialIssuerMetadataEntry = getZipEntry(zip, CREDENTIAL_ISSUER_METADATA_FILE_NAME);
		if (!credentialIssuerMetadataEntry) throw new Error('Credential Issuer .well-known not found');

		const credentialSubject = _.merge(
			templates.map((t) => credentialIssuer.objectSchemaToCredentialSubject(t))
		);

		const credentialIssuerMetadata = credentialIssuer.template({
			credential_issuer_url,
			credential_issuer_name,
			credential_name,
			authorization_server,
			credentialSubject
		});

		editZipFile(
			zip,
			CREDENTIAL_ISSUER_METADATA_FILE_NAME,
			JSON.stringify(credentialIssuerMetadata, null, 4)
		);

		/* credential.keys.json */

		const CREDENTIAL_KEYS_FILE_NAME = 'credential.keys.json';

		const credentialKeysJsonEntry = getZipEntry(zip, CREDENTIAL_KEYS_FILE_NAME);
		if (!credentialKeysJsonEntry) throw new Error(`${CREDENTIAL_KEYS_FILE_NAME} not found`);

		if (credentialKeysJsonEntry) {
			const credentialSubject = _.merge(
				templates.map((t) => credentialKeys.objectSchemaToCredentialSubject(t))
			);

			const template = credentialKeys.template({
				id: 'sadkjhaskjldh',
				issuerUrl: credential_issuer_url,
				credentialSubject
			});

			editZipFile(zip, CREDENTIAL_KEYS_FILE_NAME, JSON.stringify(template, null, 4));
		}

		/* create.schema.json */

		const CREATE_SCHEMA_JSON_FILE_NAME = 'create.schema.json';
		const createSchemaJsonEntry = getZipEntry(zip, CREATE_SCHEMA_JSON_FILE_NAME);

		if (createSchemaJsonEntry) {
			const schema = mergeObjectSchemas(templates);
			editZipFile(zip, CREATE_SCHEMA_JSON_FILE_NAME, JSON.stringify(schema, null, 2));
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

function getZipEntry(zip: AdmZip, entryPathFragment: string) {
	return zip.getEntries().find((entry) => entry.entryName.includes(entryPathFragment));
}

function editZipFile(zip: AdmZip, entryName: string, content: string) {
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
