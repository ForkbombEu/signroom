import { pb } from '$lib/pocketbase';

export const load = async () => {
	const { did } = await pb.send<{ did: JSON }>('/api/did', {});
	return { did };
};
