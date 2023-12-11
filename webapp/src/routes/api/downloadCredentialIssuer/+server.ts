import type { RequestHandler } from '@sveltejs/kit';
import AdmZip from 'adm-zip';
import type { RequestBody } from '.';
import type { CredentialIssuerMetadata } from '$lib/credentialIssuer/types';
import { templateToCredentialMetadata } from '$lib/credentialIssuer';

//

const DIDROOM_MICROSERVICES_URL =
	'https://github.com/ForkbombEu/DIDroom_microservices/archive/refs/heads/main.zip';
const CREDENTIAL_ISSUER_FILE_NAME = 'openid-credential-issuer';

//

export const POST: RequestHandler = async ({ fetch, request }) => {
	try {
		const requestBody = (await request.json()) as RequestBody;

		//

		const credentialIssuerMetadata: CredentialIssuerMetadata = {
			credential_issuer: 'todo',
			credential_endpoint: 'todo',
			credentials_supported: {}
		};

		for (const template of requestBody.templates) {
			credentialIssuerMetadata.credentials_supported[template.id] =
				templateToCredentialMetadata(template);
		}

		//

		const zipResponse = await fetch(DIDROOM_MICROSERVICES_URL);
		const buffer = Buffer.from(await zipResponse.arrayBuffer());
		const zip = new AdmZip(buffer);

		const credentialIssuerEntry = zip
			.getEntries()
			.find((entry) => entry.name === CREDENTIAL_ISSUER_FILE_NAME);
		if (!credentialIssuerEntry) throw new Error('Credential issuer file not found');

		const credentialIssuerJSON = JSON.parse(
			zip.readAsText(credentialIssuerEntry.entryName)
		) as CredentialIssuerMetadata;
		// TODO - implement proper edit
		// const updatedCredentialIssuerJSON = { ...credentialIssuerJSON, ...(await request.json()) };

		zip.updateFile(
			credentialIssuerEntry.entryName,
			Buffer.from(JSON.stringify(credentialIssuerMetadata))
		);

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
