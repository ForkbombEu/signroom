import { pb } from '$lib/pocketbase';
import {
	Collections,
	type ServicesResponse,
	type TemplatesResponse
} from '$lib/pocketbase/types.js';

export const load = async ({ params }) => {
	const { serviceId } = params;

	const expand = 'templates';

	const service = await pb
		.collection(Collections.Services)
		.getOne<ServicesResponse<{ [expand]: TemplatesResponse[] }>>(serviceId, { expand });
	return { service };
};
