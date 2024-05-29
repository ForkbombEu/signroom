import { pb } from '$lib/pocketbase/index.js';
import {
	type CoconutCredentialIssuersResponse,
	type MultisignatureSealsResponse,
	type MultisignaturesResponse,
	type UsersResponse
} from '$lib/pocketbase/types.js';

export const load = async ({ params, fetch }) => {
	const ownerExpand = 'owner';
	const issuerExpand = 'coconut_credential_issuer';

	type Multisignatures = MultisignaturesResponse<
		unknown,
		unknown,
		{ [ownerExpand]: UsersResponse; [issuerExpand]: CoconutCredentialIssuersResponse }
	>;

	const multisignature = await pb
		.collection('multisignatures')
		.getOne<Multisignatures>(params.multisignature_id, {
			expand: [ownerExpand, issuerExpand].join(', ')
		});

	//

	type Seals = MultisignatureSealsResponse<
		unknown,
		{
			[ownerExpand]: UsersResponse;
		}
	>;

	const seals = await pb.collection('multisignature_seals').getFullList<Seals>({
		filter: `multisignature.id = '${multisignature.id}'`,
		fetch,
		expand: ownerExpand
	});

	//

	return {
		multisignature,
		seals
	};
};
