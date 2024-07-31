// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { pb } from '$lib/pocketbase';
import type {
	AuthorizationServersResponse,
	IssuersResponse,
	OrganizationsResponse,
	RelyingPartiesResponse,
	ServicesResponse,
	TemplatesResponse,
	VerificationFlowsResponse
} from '$lib/pocketbase/types';
import type { RecordFullListOptions } from 'pocketbase';

//

export async function requestDownloadMicroservices(organizationId: string, fetchFn = fetch) {
	const body = await createDownloadMicroservicesRequestBody(organizationId, fetchFn);
	return await sendPostRequest('/api/download-microservices', body, fetchFn);
}

//

export type DownloadMicroservicesRequestBody = {
	authorization_servers: AuthorizationServersResponse[];
	credential_issuers: IssuersResponse[];
	relying_parties: RelyingPartiesResponse[];
	templates: TemplatesResponse[];
	issuance_flows: ServicesResponse[];
	verification_flows: VerificationFlowsResponse[];
	organization: OrganizationsResponse;
};

async function createDownloadMicroservicesRequestBody(
	organizationId: string,
	fetchFn = fetch
): Promise<DownloadMicroservicesRequestBody> {
	const pbOptions: RecordFullListOptions = {
		filter: `organization.id = '${organizationId}'`,
		fetch: fetchFn
	};

	const organization = await pb.collection('organizations').getOne(organizationId);
	const issuance_flows = await pb.collection('services').getFullList(pbOptions);
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

//

function sendPostRequest<T extends Record<string, unknown>>(url: string, body: T, fetchFn = fetch) {
	return fetchFn(url, {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			'content-type': 'application/json'
		}
	});
}
