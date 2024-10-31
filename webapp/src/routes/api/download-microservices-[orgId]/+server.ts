// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { json, type RequestHandler } from '@sveltejs/kit';
import AdmZip from 'adm-zip';
import { create_credential_issuer_zip } from './credential-issuer';
import { createAuthorizationServerZip } from './authorization-server';
import { create_relying_party_zip } from './relying-party';
import { addZipAsSubfolder } from './utils/zip';
import { createSlug } from './utils/strings';
import { startDockerCompose, endDockerCompose, setupDockerCompose } from './utils/dockercompose';

import PocketBase, { type RecordFullListOptions } from 'pocketbase';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import type {
	AuthorizationServersResponse,
	IssuersResponse,
	OrganizationsResponse,
	RelyingPartiesResponse,
	ServicesResponse,
	TemplatesResponse,
	TypedPocketBase,
	VerificationFlowsResponse
} from '$lib/pocketbase/types';
import type { Expiration } from '$lib/issuanceFlows/expiration';

//

const DIDROOM_MICROSERVICES_URL =
	'https://github.com/ForkbombEu/DIDroom_microservices/archive/refs/heads/main.zip';

export const GET: RequestHandler = async ({ fetch, request, params }) => {
	const token = request.headers.get('Authorization');
	if (!token) return errorResponse('missing_token', 401);

	try {
		const pb = new PocketBase(PUBLIC_POCKETBASE_URL) as TypedPocketBase;
		pb.authStore.save(token, null);
		const data = await fetchRequestedData(pb, params.orgId!, fetch);
		const didroom_microservices_zip = await fetchZipFileAsBuffer(DIDROOM_MICROSERVICES_URL, fetch);
		const zip = createMicroservicesZip(didroom_microservices_zip, data);
		return zipResponse(zip);
	} catch (e) {
		console.log(e);
		return errorResponse(e);
	}
};

//

async function fetchRequestedData(
	pb: TypedPocketBase,
	organizationId: string,
	fetchFn = fetch
): Promise<DownloadMicroservicesData> {
	const pbOptions: RecordFullListOptions = {
		filter: `organization.id = '${organizationId}'`,
		fetch: fetchFn
	};

	const organization = await pb.collection('organizations').getOne(organizationId);
	const issuance_flows = await pb
		.collection('services')
		.getFullList<ServicesResponse<Expiration>>(pbOptions);

	const verification_flows = await pb.collection('verification_flows').getFullList(pbOptions);
	const templates = await pb.collection('templates').getFullList(pbOptions);

	const relying_parties = (await pb.collection('relying_parties').getFullList(pbOptions)).filter(
		(rp) => verification_flows.map((vf) => vf.relying_party).includes(rp.id)
	);
	const credential_issuers = (await pb.collection('issuers').getFullList(pbOptions)).filter((ci) =>
		issuance_flows.map((flow) => flow.credential_issuer).includes(ci.id)
	);
	const authorization_servers = (
		await pb.collection('authorization_servers').getFullList(pbOptions)
	).filter((as) => issuance_flows.map((flow) => flow.authorization_server).includes(as.id));

	return {
		organization,
		issuance_flows,
		verification_flows,
		templates,
		relying_parties,
		credential_issuers,
		authorization_servers
	};
}

export type DownloadMicroservicesData = {
	authorization_servers: AuthorizationServersResponse[];
	credential_issuers: IssuersResponse[];
	relying_parties: RelyingPartiesResponse[];
	templates: TemplatesResponse[];
	issuance_flows: ServicesResponse<Expiration>[];
	verification_flows: VerificationFlowsResponse[];
	organization: OrganizationsResponse;
};

//

function createMicroservicesZip(
	didroom_microservices_zip_buffer: Buffer,
	data: DownloadMicroservicesData
): AdmZip {
	const zip = new AdmZip();

	const dockerComposeFiles = startDockerCompose();

	data.authorization_servers.forEach((a) => {
		setupDockerCompose(dockerComposeFiles, a, 'authz_server');
		const az = createAuthorizationServerZip(didroom_microservices_zip_buffer, a, data);
		addZipAsSubfolder(zip, az, `as_${createSlug(a.name)}`);
	});
	data.relying_parties.forEach((r) => {
		setupDockerCompose(dockerComposeFiles, r, 'relying_party');
		const rz = create_relying_party_zip(didroom_microservices_zip_buffer, r, data);
		addZipAsSubfolder(zip, rz, `rp_${createSlug(r.name)}`);
	});
	data.credential_issuers.forEach((c) => {
		setupDockerCompose(dockerComposeFiles, c, 'credential_issuer');
		const cz = create_credential_issuer_zip(didroom_microservices_zip_buffer, c, data);
		addZipAsSubfolder(zip, cz, `ci_${createSlug(c.name)}`);
	});

	endDockerCompose(zip, dockerComposeFiles);
	return zip;
}

//

async function fetchZipFileAsBuffer(url: string, fetchFn = fetch): Promise<Buffer> {
	const zipResponse = await fetchFn(url);
	return Buffer.from(await zipResponse.arrayBuffer());
}

function zipResponse(zip: AdmZip) {
	return new Response(zip.toBuffer(), {
		status: 200,
		headers: {
			'Content-Type': 'application/octet-stream'
		}
	});
}

function errorResponse(e: unknown, status = 500) {
	let message = 'Internal Server Error';
	if (e instanceof Error) message = e.message;
	else if (typeof e == 'string') message = e;

	return new Response(message, {
		status
	});
}
