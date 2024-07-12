// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { zencodeExec } from '$lib/keypairoom/keypair';
import type {
	CoconutCredentialIssuersResponse,
	MultisignatureSealsResponse,
	MultisignaturesResponse
} from '$lib/pocketbase/types';
import addSignatureToReflowSealContract from '../../../../../../client_zencode/reflow/reflow-6-anyone-add-signature-to-reflow-seal.zen?raw';
import verifySignedReflowSealContract from '../../../../../../client_zencode/reflow/reflow-7-anyone-verify-signed-reflow-seal.zen?raw';

//

async function addSignatureToReflowSeal(
	coconutIssuer: CoconutCredentialIssuersResponse,
	reflow_seal: MultisignaturesResponse['reflow_seal'],
	seal: MultisignatureSealsResponse
) {
	const data = {
		issuer_public_key: coconutIssuer.issuer_public_key,
		...(reflow_seal as Record<string, unknown>),
		reflow_signature: (seal.signature as Record<string, unknown>)['reflow_signature']
	};
	return await zencodeExec(addSignatureToReflowSealContract, { data });
}

type ReflowSealContractResponse = {
	reflow_seal: {
		SM: string;
		fingerprints: string[];
		identity: string;
		verifier: string;
	};
};

export async function addSignaturesToReflowSeal(
	coconutIssuer: CoconutCredentialIssuersResponse,
	multisignature: MultisignaturesResponse,
	seals: MultisignatureSealsResponse[]
) {
	let reflow_seal = multisignature.reflow_seal;
	for (const seal of seals) {
		reflow_seal = await addSignatureToReflowSeal(coconutIssuer, reflow_seal, seal);
	}
	return reflow_seal as ReflowSealContractResponse;
}

//

export async function verifySignedReflowSeal(
	signedReflowSeal: ReflowSealContractResponse,
	reflow_seal_source: Record<string, unknown>
) {
	const data = { ...signedReflowSeal, reflow_seal_source };
	return await zencodeExec<{ output: [string] }>(verifySignedReflowSealContract, { data });
}
