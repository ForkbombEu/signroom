import { pb } from '$lib/pocketbase/index.js';
import {
	Collections,
	type CoconutCredentialIssuersResponse,
	type MultisignatureSealsResponse,
	type MultisignaturesResponse
} from '$lib/pocketbase/types.js';
import type { IssuerPublicKeys } from './logic.js';

export const load = async ({ params }) => {
	const seal = await pb
		.collection(Collections.MultisignatureSeals)
		.getOne<MultisignatureSealsResponse>(params.seal_id);

	const multisignature = await pb
		.collection(Collections.Multisignatures)
		.getOne<MultisignaturesResponse>(seal.multisignature);

	const issuer = await pb
		.collection(Collections.CoconutCredentialIssuers)
		.getOne<CoconutCredentialIssuersResponse<IssuerPublicKeys>>(
			multisignature.coconut_credential_issuer
		);

	return {
		seal,
		multisignature,
		issuer
	};
};
