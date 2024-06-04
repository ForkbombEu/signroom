import { i18n } from '$lib/i18n/index.js';
import { pb } from '$lib/pocketbase';

export const load = async ({ url }) => {
	const globals = await pb.collection('globals').getFullList();

	const localizedGlobal = globals.find((g) => g.locale == i18n.getLanguageFromUrl(url));
	const enGlobal = globals.find((g) => g.locale == 'en');
	const firstGlobal = globals.at(0);

	return {
		content: localizedGlobal ?? enGlobal ?? firstGlobal
	};
};
