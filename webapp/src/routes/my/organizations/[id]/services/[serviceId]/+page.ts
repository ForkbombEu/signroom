import { pb } from '$lib/pocketbase';
import { Collections, type ServicesResponse } from '$lib/pocketbase/types.js';

export const load = async ({ params, fetch }) => {
	const { serviceId } = params;
	const service = await pb.collection(Collections.Services).getOne<ServicesResponse>(serviceId, {
		fetch
	});
	return { service };
};
