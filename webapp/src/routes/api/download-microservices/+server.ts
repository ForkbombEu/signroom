import type { RequestHandler } from '@sveltejs/kit';
import AdmZip from 'adm-zip';
import { type DownloadMicroservicesRequestBody } from '.';
import { createCredentialIssuerZip } from './credential-issuer';
import { createAuthorizationServerZip } from './authorization-server';
import { createRelyingPartyZip } from './relying-party';
import { addZipAsSubfolder } from './utils/zip';
import { createSlug } from './utils/data';

//

export const POST: RequestHandler = async ({ fetch, request }) => {
	try {
		const didroom_microservices_zip = await fetchZipFileAsBuffer(fetch);
		const data = await parseRequestBody(request);

		const zip = new AdmZip();

		data.authorization_servers.forEach((a) => {
			const az = createAuthorizationServerZip(didroom_microservices_zip, a, data);
			addZipAsSubfolder(zip, az, createSlug(a.name));
		});
		data.relying_parties.forEach((r) => {
			const rz = createRelyingPartyZip(didroom_microservices_zip, r, data);
			addZipAsSubfolder(zip, rz, createSlug(r.name));
		});
		data.credential_issuers.forEach((c) => {
			const cz = createCredentialIssuerZip(didroom_microservices_zip, c, data);
			addZipAsSubfolder(zip, cz, createSlug(c.name));
		});

		return zipResponse(zip);
	} catch (e) {
		console.log(e);
		return errorResponse(e);
	}
};

//

function parseRequestBody(request: Request): Promise<DownloadMicroservicesRequestBody> {
	return request.json();
}

async function fetchZipFileAsBuffer(fetchFn = fetch): Promise<Buffer> {
	const DIDROOM_MICROSERVICES_URL =
		'https://github.com/ForkbombEu/DIDroom_microservices/archive/refs/heads/main.zip';
	const zipResponse = await fetchFn(DIDROOM_MICROSERVICES_URL);
	return Buffer.from(await zipResponse.arrayBuffer());
}

//

function zipResponse(zip: AdmZip) {
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
