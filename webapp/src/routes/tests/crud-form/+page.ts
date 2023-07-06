import { pb } from '$lib/pocketbase';
import { Collections } from '$lib/pocketbase-types';

export const load = async () => {
	try {
		const item = await pb.collection(Collections.CrudExample).getOne('pjjpk0n30ochy4l');
		return { item };
	} catch (_) {
		return {};
	}
};
