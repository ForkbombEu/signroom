import { getUserPublicKeys } from '$lib/keypairoom/utils';

export const load = async () => {
	const publicKeys = getUserPublicKeys();
	return {
		publicKeys
	};
};
