import { pb } from '$lib/pocketbase/index.js';
import { Collections, type MultisignaturesResponse } from '$lib/pocketbase/types.js';

export const load = async ({ params }) => {
	const multisignature = await pb
		.collection(Collections.Multisignatures)
		.getOne<MultisignaturesResponse>(params.multisignature_id);

	return {
		multisignature
	};
};
