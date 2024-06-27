import type { SignedFile } from './types';

export async function validateSignedFile(
	signedFile: SignedFile
): Promise<SignatureValidationResult> {
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
		signatureOrTimestampOrEvidenceRecord: Array<{
			Signature: {
				SubIndication: string;
				AdESValidationDetails: { Error: Array<{ value: string; key: string }> };
			};
		}>;
	};
};

export function isSignatureValid(validationResult: SignatureValidationResult): boolean {
	return validationResult.SimpleReport.ValidSignaturesCount == 1;
}
