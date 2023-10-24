import { pb } from '$lib/pocketbase';
import { Collections, type ServicesResponse } from '$lib/pocketbase/types.js';

export const load = async ({ parent }) => {
	const { organization } = await parent();

	const services = await pb.collection(Collections.Services).getFullList<ServicesResponse>({
		filter: `organization.id = '${organization.id}' && published = true`,
		sort: 'updated'
	});

	return { services };
};
