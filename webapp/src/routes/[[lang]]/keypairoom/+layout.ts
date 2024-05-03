import { loadFeatureFlags } from '$lib/features';
import { error } from '@sveltejs/kit';

<<<<<<< ours
export const load = async ({ fetch }) => {
	if (!(await loadFeatureFlags(fetch)).KEYPAIROOM) throw error(404);
=======
export const load = async () => {
	if (!(await loadFeatureFlags()).KEYPAIROOM) throw error(404);
>>>>>>> theirs
};
