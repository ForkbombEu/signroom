import { pb } from '$lib/pocketbase';
import { dowloadResponseAsZip } from '$lib/utils/clientFileDownload';
import { request, type RequestBody } from '@api/download-microservices';

export async function downloadMicroservices(organizationId: string, fetchFn = fetch) {
	const data = await createRequestBody(organizationId);
	const response = await request(data, fetchFn);
	if (!response.ok) throw new Error(response.statusText);
	dowloadResponseAsZip(response, 'microservices.zip');
}

async function createRequestBody(organizationId: string): Promise<RequestBody> {
	const organization = await pb.collection('organizations').getOne(organizationId);
	const filter = `organization.id = '${organizationId}'`;

	const issuance_flows = await pb.collection('services').getFullList({ filter });
	const verification_flows = await pb.collection('verification_flows').getFullList({ filter });

	const templates = await pb.collection('templates').getFullList({ filter });

	const relying_parties = await pb.collection('relying_parties').getFullList({ filter });
	const credential_issuers = await pb.collection('issuers').getFullList({ filter });
	const authorization_servers = await pb
		.collection('authorization_servers')
		.getFullList({ filter });

	return {
		organization,
		credential_issuers,
		authorization_servers,
		relying_parties,
		issuance_flows,
		verification_flows,
		templates
	};
}
