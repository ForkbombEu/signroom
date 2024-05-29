import { z } from 'zod';
import { persisted } from 'svelte-persisted-store';
import {
	Collections,
	MultisignatureSealsStatusOptions,
	type MultisignatureSealsRecord,
	type MultisignatureSealsResponse,
	type MultisignaturesRecord,
	type MultisignaturesResponse
} from '$lib/pocketbase/types';
import { pb } from '$lib/pocketbase';
import type { ClientResponseError } from 'pocketbase';

import { Effect, pipe } from 'effect';
import * as A from 'effect/Array';

import createReflowSealContract from '../../../../../../client_zencode/reflow/reflow-4-organizare-create-reflow-seal.zen?raw';
import { zencodeExec } from '$lib/keypairoom/keypair';
import { getUserPublicKeys } from '$lib/keypairoom/utils';

//

type ParticipantsReflowPublicKeys = Record<string, { reflow_public_key: string }>;

type ReflowSealContractReturn = {
	reflow_seal: {
		SM: string;
		identity: string;
		verifier: string;
	};
};

export function createReflowSeal(
	reflow_seal_source: string,
	public_keys: ParticipantsReflowPublicKeys
) {
	return zencodeExec<ReflowSealContractReturn>(createReflowSealContract, {
		data: {
			reflow_seal_source,
			public_keys
		},
		conf: 'logfmt=text'
	});
}

export async function getParticipantsReflowPublicKeys(
	ids: string[]
): Promise<ParticipantsReflowPublicKeys> {
	const participantsPublicKeys = await Promise.all(ids.map((id) => getUserPublicKeys(id)));
	const publicKeysRecord: ParticipantsReflowPublicKeys = {};
	for (const pubKeys of participantsPublicKeys) {
		if (pubKeys) {
			publicKeysRecord[pubKeys.owner] = { reflow_public_key: pubKeys.reflow_public_key };
		}
	}
	return publicKeysRecord;
}

//

export const setupSchema = z.object({
	name: z.string(),
	credentialIssuer: z.string(),
	contentJSON: z.string(),
	sealExpirationDate: z
		.string()
		.regex(/^(19|20)\d\d-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/, 'Invalid date format')
		.refine((s) => new Date(s) > new Date(), 'Date must be after than today')
});

export const participantsSchema = z.object({
	participants: z.array(z.string()).min(1)
});

export const ownerSchema = z.object({
	owner: z.string()
});

export const multisignatureFormDataSchema = setupSchema
	.merge(participantsSchema)
	.merge(ownerSchema);

//

export type MultisignatureFormData = z.infer<typeof multisignatureFormDataSchema>;

const defaultMultisignatureFormData: MultisignatureFormData = {
	name: '',
	credentialIssuer: '',
	contentJSON: '',
	sealExpirationDate: '',
	participants: [],
	owner: ''
};

export const multisignatureFormData = persisted<MultisignatureFormData>(
	'multisignatureFormData',
	defaultMultisignatureFormData
);

export function resetMultisignatureFormData() {
	multisignatureFormData.set(defaultMultisignatureFormData);
}

//

type CreateMultisignatureData = MultisignatureFormData & { reflow_seal: ReflowSealContractReturn };

export async function createMultisignatureAndSeals(data: CreateMultisignatureData) {
	const multisignature = await Effect.runPromise(createMultisignature(data));
	await Effect.runPromise(createMultisignatureSeals(multisignature.id, data));
	return multisignature;
}

function createMultisignature(data: CreateMultisignatureData) {
	return Effect.tryPromise({
		try: () => {
			const { owner, name, credentialIssuer, contentJSON } = data;

			const multisignatureData: MultisignaturesRecord = {
				owner,
				name,
				coconut_credential_issuer: credentialIssuer,
				content_json: contentJSON,
				reflow_seal: data.reflow_seal
			};

			return pb
				.collection(Collections.Multisignatures)
				.create<MultisignaturesResponse>(multisignatureData);
		},
		catch: (e) => {
			return e as ClientResponseError;
		}
	});
}

function createMultisignatureSeal(data: MultisignatureSealsRecord) {
	return Effect.tryPromise({
		try: () => pb.collection('multisignature_seals').create(data),
		catch: (e) => {
			return e as ClientResponseError;
		}
	});
}

function createMultisignatureSeals(multisignatureId: string, data: MultisignatureFormData) {
	return pipe(
		data.participants,
		A.map((id) =>
			createMultisignatureSeal({
				owner: id,
				multisignature: multisignatureId,
				status: MultisignatureSealsStatusOptions.pending,
				signature_deadline: new Date(data.sealExpirationDate).toISOString()
			})
		),
		Effect.all
	);
}
