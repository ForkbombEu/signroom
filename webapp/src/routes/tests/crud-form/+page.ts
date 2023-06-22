import { pb } from '$lib/pocketbase';
import { Collections } from '$lib/pocketbase-types';

export const load = async () => {
	const item = await pb.collection(Collections.CrudExample).getOne('i13vksnjqhcvrew');
	return { item };
};
