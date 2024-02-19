import { pb } from '$lib/pocketbase';
import {
	Collections,
	type AuthorizationServersResponse,
	type ServicesResponse,
	type TemplatesResponse,
	type IssuersResponse,
	type RelyingPartiesResponse
} from '$lib/pocketbase/types.js';

const templatesExpand = 'templates';
const authorizationServerExpand = 'authorization_server';
const credentialIssuerExpand = 'issuer';
const relyingPartyExpand = 'relying_party';

export type Service = ServicesResponse<{
	[templatesExpand]: TemplatesResponse[];
	[authorizationServerExpand]: AuthorizationServersResponse;
	[credentialIssuerExpand]: IssuersResponse;
	[relyingPartyExpand]: RelyingPartiesResponse;
}>;

export const load = async ({ params, fetch }) => {
	const { serviceId } = params;

	const expand = [
		templatesExpand,
		authorizationServerExpand,
		credentialIssuerExpand,
		relyingPartyExpand
	].join(', ');

	const service = await pb
		.collection(Collections.Services)
		.getOne<Service>(serviceId, { expand, fetch });
	return { service };
};
