import { pb } from '$lib/pocketbase';
import {
	Collections,
	OrgJoinRequestsStatusOptions,
	type OrgJoinRequestsResponse,
	type ServicesResponse
} from '$lib/pocketbase/types.js';

export const load = async ({ parent, fetch }) => {
	const { organization } = await parent();

	const services = await pb.collection(Collections.Services).getFullList<ServicesResponse>({
		filter: `organization.id = '${organization.id}' && public = true`,
		sort: 'updated',
		fetch
	});

	const requests = await pb
		.collection(Collections.OrgJoinRequests)
		.getFullList<OrgJoinRequestsResponse>({
			filter: `organization.id = '${organization.id}' && status = "${OrgJoinRequestsStatusOptions.pending}"`,
			fetch
		});

	return { services, requests };
};
