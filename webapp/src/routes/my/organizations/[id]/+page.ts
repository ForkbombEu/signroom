import { pb } from '$lib/pocketbase';
import {
	Collections,
	OrgJoinRequestsStatusOptions,
	type OrgJoinRequestsResponse,
	type ServicesResponse
} from '$lib/pocketbase/types.js';

export const load = async ({ parent }) => {
	const { organization } = await parent();

	const services = await pb.collection(Collections.Services).getFullList<ServicesResponse>({
		filter: `organization.id = '${organization.id}' && published = true`,
		sort: 'updated'
	});

	const requests = await pb
		.collection(Collections.OrgJoinRequests)
		.getFullList<OrgJoinRequestsResponse>({
			filter: `organization.id = '${organization.id}' && status = "${OrgJoinRequestsStatusOptions.pending}"`
		});

	return { services, requests };
};
