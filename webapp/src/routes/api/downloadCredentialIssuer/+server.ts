import type { RequestHandler } from '@sveltejs/kit';
import AdmZip from 'adm-zip';
import type { RequestBody } from '.';
import {
	credentialIssuerMetadataTemplate,
	objectSchemaToCredentialSubject
} from '$lib/credentialIssuer';
import path from 'node:path';

//

const DIDROOM_MICROSERVICES_URL =
	'https://github.com/ForkbombEu/DIDroom_microservices/archive/refs/heads/main.zip';
const CREDENTIAL_ISSUER_METADATA_FILE_NAME = 'openid-credential-issuer';

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

		//

		const credentialIssuerMetadata = credentialIssuerMetadataTemplate({
			credential_issuer_url,
			credential_issuer_name,
			credential_name,
			authorization_server,
			credentialSubject: templates.reduce((acc, curr) => {
				return { ...acc, ...objectSchemaToCredentialSubject(JSON.parse(curr)) };
			}, {})
		});

		//

		const zipResponse = await fetch(DIDROOM_MICROSERVICES_URL);
		const buffer = Buffer.from(await zipResponse.arrayBuffer());
		const zip = new AdmZip(buffer);
		const zipName = zip.getEntries()[0]?.entryName.split('/')[0];

		const credentialIssuerMetadataEntry = zip
			.getEntries()
			.find((entry) => entry.name === CREDENTIAL_ISSUER_METADATA_FILE_NAME);

		zip.addFile(
			credentialIssuerMetadataEntry?.entryName ??
				path.join(zipName, 'public/.well-known', CREDENTIAL_ISSUER_METADATA_FILE_NAME),
			Buffer.from(JSON.stringify(credentialIssuerMetadata, null, 4))
		);

		//

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

const editFile = (zip: AdmZip, entryName: string, content: string) => {
	const entry = zip.getEntries().find((entry) => entry.name === entryName);
	if (!entry) return;

	zip.updateFile(entry, Buffer.from(content));
};
