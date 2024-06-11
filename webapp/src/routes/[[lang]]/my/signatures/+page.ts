import { pb } from '$lib/pocketbase/index.js';

export const _FOLDER_PARAM = 'folder';

export const load = async ({ url }) => {
	const folderId = url.searchParams.get(_FOLDER_PARAM);
	if (!folderId) return {};

	const folder = await pb.collection('folders').getOne(folderId);
	return { folder };
};
