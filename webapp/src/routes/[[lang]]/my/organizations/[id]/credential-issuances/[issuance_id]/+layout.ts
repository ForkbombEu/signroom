// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Expiration } from '$lib/issuanceFlows/expiration.js';
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

export type Service = ServicesResponse<
	Expiration,
	{
		[credentialTemplateExpand]: TemplatesResponse;
		[authorizationTemplateExpand]: TemplatesResponse;
		[credentialIssuerExpand]: IssuersResponse;
		[authorizationServerExpand]: AuthorizationServersResponse;
	}
>;

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

	return { service };
};
