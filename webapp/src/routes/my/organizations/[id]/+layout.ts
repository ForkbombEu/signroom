// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { pb } from '$lib/pocketbase';
import { blockNonMembers } from '$lib/organizations';

export const load = async ({ params, fetch }) => {
	const organizationId = params.id;

	await blockNonMembers(organizationId, fetch);

	const organization = await pb.collection('organizations').getOne(organizationId, {
		fetch,
		requestKey: null
	});

	const issuanceFlows = await pb.collection('services').getFullList({
		filter: `organization.id = '${params.id}'`,
		fetch,
		requestKey: null
	});

	const usedIssuanceFlowTypeNames = issuanceFlows.map((issuanceFlow) => issuanceFlow.type_name);

	return { organization, issuanceFlows, usedIssuanceFlowTypeNames };
};
