import type {
	AuthorizationServersResponse,
	IssuersResponse,
	OrganizationsResponse,
	RelyingPartiesResponse,
	ServicesResponse,
	TemplatesResponse,
	VerificationFlowsResponse
} from '$lib/pocketbase/types';

//

export type RequestBody = {
	authorization_servers: AuthorizationServersResponse[];
	credential_issuers: IssuersResponse[];
	relying_parties: RelyingPartiesResponse[];
	templates: TemplatesResponse[];
	issuance_flows: ServicesResponse[];
	verification_flows: VerificationFlowsResponse[];
	organization: OrganizationsResponse;
};

export function request(body: RequestBody, fetchFn = fetch) {
	return fetchFn('/api/download-microservices', {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			'content-type': 'application/json'
		}
	});
}
