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
import * as A from 'effect/ReadonlyArray';

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

export async function createMultisignatureAndSeals(data: MultisignatureFormData) {
	await pipe(
		createMultisignature(data),
		Effect.flatMap((multisignature) => createMultisignatureSeals(multisignature.id, data)),
		Effect.runPromise
	);
}

function createMultisignature(data: MultisignatureFormData) {
	return Effect.tryPromise({
		try: () => {
			const { owner, name, credentialIssuer, contentJSON } = data;

			const multisignatureData: MultisignaturesRecord = {
				owner,
				name,
				coconut_credential_issuer: credentialIssuer,
				content_json: contentJSON
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

function createMultisignatureSeal(
	data: MultisignatureSealsRecord
): Effect.Effect<MultisignatureSealsResponse, ClientResponseError, never> {
	return Effect.tryPromise({
		try: () =>
			pb.collection(Collections.MultisignatureSeals).create<MultisignatureSealsResponse>(data),
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
