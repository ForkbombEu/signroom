// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { SignedFile } from './types';

export async function validateSignedFile(
	signedFile: SignedFile
): Promise<ValidateSignatureResponse> {
	const validate = await fetch('/api/validateSignature', {
		method: 'POST',
		body: JSON.stringify({ signedDocument: signedFile }),
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	});
	return await validate.json();
}

export type SignatureValidationResult = {
	SimpleReport: {
		ValidSignaturesCount: number;
		signatureOrTimestampOrEvidenceRecord: null | Array<{
			Signature: {
				SubIndication: string;
				AdESValidationDetails: { Error: Array<{ value: string; key: string }> };
			};
		}>;
	};
};

type ErrorMessage = { message: string };
export type ValidateSignatureResponse = SignatureValidationResult | ErrorMessage;

export function isSignatureValid(validationResult: SignatureValidationResult): boolean {
	return validationResult.SimpleReport.ValidSignaturesCount == 1;
}
