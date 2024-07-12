// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { pb } from '$lib/pocketbase';
import {
	Collections,
	type VerificationFlowsResponse,
	type TemplatesResponse,
	type RelyingPartiesResponse
} from '$lib/pocketbase/types.js';

//

const templateExpand = 'template';
const relyingPartyExpand = 'relying_party';

export type VerificationFlow = VerificationFlowsResponse<{
	[templateExpand]: TemplatesResponse;
	[relyingPartyExpand]: RelyingPartiesResponse;
}>;

export const load = async ({ params, fetch }) => {
	const { verification_flow_id } = params;

	const expand = [templateExpand, relyingPartyExpand].join(', ');

	const verificationFlow = await pb
		.collection(Collections.VerificationFlows)
		.getOne<VerificationFlow>(params.verification_flow_id, { expand, fetch });
	return { verificationFlow, verification_flow_id };
};
