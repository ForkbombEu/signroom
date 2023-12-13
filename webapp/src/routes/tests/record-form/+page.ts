import { pb } from '$lib/pocketbase';
import { Collections, type CrudExampleResponse } from '$lib/pocketbase/types';

export const load = async ({ fetch }) => {
	try {
		const item = await pb
			.collection(Collections.CrudExample)
			.getOne<CrudExampleResponse>('53q5yve2r8scku7', { fetch });
		return { item };
	} catch (_) {
		return {};
	}
};
