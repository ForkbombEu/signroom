import { pb } from '$lib/pocketbase/index.js';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	try {
		const issuanceFlow = await pb.collection('issuance_flow_public_data').getOne(params.id);
		return { issuanceFlow };
	} catch {
		error(404);
	}
};
