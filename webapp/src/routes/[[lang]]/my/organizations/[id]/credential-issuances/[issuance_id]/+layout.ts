import { pb } from '$lib/pocketbase';
import {
	Collections,
	type AuthorizationServersResponse,
	type ServicesResponse,
	type TemplatesResponse,
	type IssuersResponse
} from '$lib/pocketbase/types.js';

//

const credentialTemplateExpand = 'credential_template';
const authorizationTemplateExpand = 'authorization_template';

const credentialIssuerExpand = 'credential_issuer';
const authorizationServerExpand = 'authorization_server';

//

export type Service = ServicesResponse<{
	[credentialTemplateExpand]: TemplatesResponse;
	[authorizationTemplateExpand]: TemplatesResponse;
	[credentialIssuerExpand]: IssuersResponse;
	[authorizationServerExpand]: AuthorizationServersResponse;
}>;

export const load = async ({ params, fetch }) => {
	const expand = [
		credentialTemplateExpand,
		authorizationTemplateExpand,
		authorizationServerExpand,
		credentialIssuerExpand
	].join(', ');

	const service = await pb
		.collection(Collections.Services)
		.getOne<Service>(params.issuance_id, { expand, fetch });

	const servicesWithSharedAuthServer = await pb
		.collection(Collections.Services)
		.getFullList<Service>({
			filter: `authorization_server = '${service.authorization_server}'`,
			fetch
		});

	const authServerScopesSupported = servicesWithSharedAuthServer.map((s) => s.type_name);

	return { service, authServerScopesSupported };
};
