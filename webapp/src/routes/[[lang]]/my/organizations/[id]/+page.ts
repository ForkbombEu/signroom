import { pb } from '$lib/pocketbase';
import {
	Collections,
	OrgJoinRequestsStatusOptions,
	type AuthorizationServersResponse,
	type IssuersResponse,
	type OrgJoinRequestsResponse,
	type RelyingPartiesResponse,
	type ServicesResponse,
	type TemplatesResponse,
	type VerificationFlowsResponse
} from '$lib/pocketbase/types.js';

export const load = async ({ params, fetch }) => {
	const issuanceFlows = await pb.collection(Collections.Services).getFullList<ServicesResponse>({
		filter: `organization.id = '${params.id}'`,
		fetch
	});

	const verificationFlows = await pb
		.collection(Collections.VerificationFlows)
		.getFullList<VerificationFlowsResponse>({
			filter: `organization.id = '${params.id}'`,
			fetch
		});

	const templates = await pb.collection(Collections.Templates).getFullList<TemplatesResponse>({
		filter: `organization.id = '${params.id}'`,
		fetch
	});

	const relyingParties = await pb
		.collection(Collections.RelyingParties)
		.getFullList<RelyingPartiesResponse>({
			filter: `organization.id = '${params.id}'`,
			fetch
		});
	const credentialIssuers = await pb.collection(Collections.Issuers).getFullList<IssuersResponse>({
		filter: `organization.id = '${params.id}'`,
		fetch
	});
	const authorizationServers = await pb
		.collection(Collections.AuthorizationServers)
		.getFullList<AuthorizationServersResponse>({
			filter: `organization.id = '${params.id}'`,
			fetch
		});
	const microservices = [...relyingParties, ...credentialIssuers, ...authorizationServers];

	const membershipRequests = await pb
		.collection(Collections.OrgJoinRequests)
		.getFullList<OrgJoinRequestsResponse>({
			filter: `organization.id = '${params.id}' && status = "${OrgJoinRequestsStatusOptions.pending}"`,
			fetch
		});

	return { issuanceFlows, verificationFlows, templates, microservices, membershipRequests };
};
