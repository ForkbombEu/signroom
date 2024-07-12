// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { zencodeExec, type Keyring } from '$lib/keypairoom/keypair';
import { pb } from '$lib/pocketbase';
import {
	MultisignatureSealsStatusOptions,
	type CoconutCredentialIssuersResponse,
	type MultisignatureSealsRecord,
	type MultisignaturesResponse
} from '$lib/pocketbase/types';
import generateCredentialRequestContract from '../../../../../../../client_zencode/coconut/Coconut-1-participant-generate-credential-request.zen?raw';
import aggregateCredentialSignaturesContract from '../../../../../../../client_zencode/coconut/Coconut-2-participant-aggregate-credential-signatures.zen?raw';
// import generateAnonymisedProofContract from '../../../../../../../client_zencode/coconut/Coconut-3-participant-generate-anonymised-proof.zen?raw';
import signReflowSealContract from '../../../../../../../client_zencode/reflow/reflow-5-participant-sign-reflow-seal.zen?raw';

//

export async function signSeal(
	keyring: Keyring,
	issuer: CoconutCredentialIssuersResponse<IssuerPublicKeys>,
	multisignature: MultisignaturesResponse
) {
	const credentialRequest = await generateCredentialRequest(keyring);

	const credentialSignatureResponse = await sendCredentialRequestToIssuer(
		credentialRequest,
		issuer.endpoint
	);

	const aggregatedSignature = await aggregateCredentialSignatures(
		keyring,
		credentialSignatureResponse.credential_signature
	);

	// const anonymisedProof = await generateAnonymisedProof({
	// 	keyring,
	// 	...aggregatedSignature,
	// 	...{
	// 		issuer_public_key: issuer.issuer_public_key!
	// 	}
	// });

	const reflowSignatureResponse = await signReflowSeal(
		aggregatedSignature.credentials,
		keyring,
		multisignature.reflow_seal,
		issuer.issuer_public_key!
	);

	return reflowSignatureResponse;
}

//

type CredentialRequestResponse = { credential_request: Record<string, unknown> };

async function generateCredentialRequest(keyring: Keyring) {
	return await zencodeExec<CredentialRequestResponse>(generateCredentialRequestContract, {
		data: {
			keyring
		}
	});
}

//

type CredentialSignatureResponse = { credential_signature: Record<string, unknown> };

async function sendCredentialRequestToIssuer(
	credentialRequest: CredentialRequestResponse,
	issuerEndpoint: string
) {
	const response = await fetch(issuerEndpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(credentialRequest)
	});
	return (await response.json()) as CredentialSignatureResponse;
}

//

type AggregatedSignatureResponse = { credentials: Record<string, unknown> };

async function aggregateCredentialSignatures(
	keyring: Keyring,
	credential_signature: CredentialSignatureResponse['credential_signature']
) {
	return await zencodeExec<AggregatedSignatureResponse>(aggregateCredentialSignaturesContract, {
		data: {
			keyring,
			credential_signature
		}
	});
}

//

export type IssuerPublicKeys = {
	alpha: string;
	beta: string;
};

// type CredentialProofResponse = {
// 	credential_proof: Record<string, unknown>;
// };

// async function generateAnonymisedProof(
// 	data: { keyring: Keyring } & AggregatedSignatureResponse & { issuer_public_key: IssuerPublicKeys }
// ) {
// 	return await zencodeExec<CredentialProofResponse>(generateAnonymisedProofContract, {
// 		data
// 	});
// }

//

type ReflowSignatureResponse = {
	reflow_signature: Record<string, unknown>;
};

async function signReflowSeal(
	credentials: CredentialSignatureResponse['credential_signature'],
	keyring: Keyring,
	reflow_seal: MultisignaturesResponse['reflow_seal'],
	issuer_public_key: IssuerPublicKeys
) {
	const data = {
		credentials,
		keyring,
		reflow_seal: (reflow_seal as Record<string, unknown>)['reflow_seal'],
		CoconutIssuer: { issuer_public_key }
	};

	return await zencodeExec<ReflowSignatureResponse>(signReflowSealContract, {
		data,
		conf: 'logfmt=text'
	});
}

//

export async function saveReflowSignature(
	sealId: string,
	reflowSignatureResponse: ReflowSignatureResponse
) {
	const data: Partial<MultisignatureSealsRecord> = {
		signature: reflowSignatureResponse,
		status: MultisignatureSealsStatusOptions.signed
	};
	await pb.collection('multisignature_seals').update(sealId, data);
}
