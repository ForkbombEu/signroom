import type { RequestHandler } from '@sveltejs/kit';
import AdmZip from 'adm-zip';

//

const DIDROOM_MICROSERVICES_URL =
	'https://github.com/ForkbombEu/DIDroom_microservices/archive/refs/heads/main.zip';
const CREDENTIAL_ISSUER_FILE_NAME = 'openid-credential-issuer';

//

export const POST: RequestHandler = async ({ fetch, request }) => {
	try {
		const response = await fetch(DIDROOM_MICROSERVICES_URL);
		const buffer = Buffer.from(await response.arrayBuffer());
		const zip = new AdmZip(buffer);

		const credentialIssuerEntry = zip
			.getEntries()
			.find((entry) => entry.name === CREDENTIAL_ISSUER_FILE_NAME);
		if (!credentialIssuerEntry) throw new Error('Credential issuer file not found');

		const credentialIssuerJSON = JSON.parse(zip.readAsText(credentialIssuerEntry.entryName));
		// TODO - implement proper edit
		const updatedCredentialIssuerJSON = { ...credentialIssuerJSON, ...(await request.json()) };

		zip.updateFile(
			credentialIssuerEntry.entryName,
			Buffer.from(JSON.stringify(updatedCredentialIssuerJSON))
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
