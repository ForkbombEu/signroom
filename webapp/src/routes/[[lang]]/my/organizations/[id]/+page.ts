// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { pb } from '$lib/pocketbase';
import { OrgJoinRequestsStatusOptions } from '$lib/pocketbase/types.js';

export const load = async ({ params, fetch }) => {
	const verificationFlows = await pb.collection('verification_flows').getFullList({
		filter: `organization.id = '${params.id}'`,
		fetch
	});

	const templates = await pb.collection('templates').getFullList({
		filter: `organization.id = '${params.id}'`,
		fetch
	});

	const relyingParties = await pb.collection('relying_parties').getFullList({
		filter: `organization.id = '${params.id}'`,
		fetch
	});
	const credentialIssuers = await pb.collection('issuers').getFullList({
		filter: `organization.id = '${params.id}'`,
		fetch
	});
	const authorizationServers = await pb.collection('authorization_servers').getFullList({
		filter: `organization.id = '${params.id}'`,
		fetch
	});
	const microservices = [...relyingParties, ...credentialIssuers, ...authorizationServers];

	const membershipRequests = await pb.collection('orgJoinRequests').getFullList({
		filter: `organization.id = '${params.id}' && status = "${OrgJoinRequestsStatusOptions.pending}"`,
		fetch
	});

	return { verificationFlows, templates, microservices, membershipRequests };
};
