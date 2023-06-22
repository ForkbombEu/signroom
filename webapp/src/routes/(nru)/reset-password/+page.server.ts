import type { Actions } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

export const load = async ({ request, url }) => {
	const code = url.searchParams.get('code');
	// if (!code) {
	// 	throw error(400, 'Missing code');
	// }

	return {};
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		return { success: true };
	}
};
