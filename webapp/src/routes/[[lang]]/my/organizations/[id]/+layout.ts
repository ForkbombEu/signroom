// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { pb } from '$lib/pocketbase';
import { Collections, type OrganizationsResponse } from '$lib/pocketbase/types';

export const load = async ({ params, fetch }) => {
	const organizationId = params.id;
	const organization = await pb
		.collection(Collections.Organizations)
		.getOne<OrganizationsResponse>(organizationId, {
			fetch,
			requestKey: null
		});

<<<<<<< fix-org-microservice-unique
	const issuanceFlows = await pb.collection('services').getFullList({
		filter: `organization.id = '${params.id}'`,
		fetch,
		requestKey: null
	});

	const usedIssuanceFlowTypeNames = issuanceFlows.map((issuanceFlow) => issuanceFlow.type_name);
=======
	const usedIssuanceFlowTypeNames = (
		await pb.collection('services').getFullList({ requestKey: null })
	).map((issuanceFlow) => issuanceFlow.type_name);
>>>>>>> main

	return { organization, usedIssuanceFlowTypeNames };
};
