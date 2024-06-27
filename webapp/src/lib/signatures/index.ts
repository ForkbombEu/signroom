import { SignaturesTypeOptions, type SignaturesResponse } from '$lib/pocketbase/types';
import { downloadBlob } from '$lib/utils/clientFileDownload';
import { lookup, mimes } from 'mrmime';
import { Buffer } from 'buffer';
import formatXml from 'xml-formatter';

//

export type SignedFile = {
	name: string;
	bytes: string;
	digestAlgorithm: string;
};

export type Signature<Texpand extends unknown = unknown> = SignaturesResponse<SignedFile, Texpand>;

//

export function signedFileToBlob(signedFile: SignedFile): Blob {
	const mime = lookup(signedFile.name);
	const data = Buffer.from(signedFile.bytes, 'base64');
	return new Blob([data], {
		type: mime
	});
}

export function downloadSignedFile(signature: Signature) {
	const signedFile = signature.signed_file!;
	const fileBlob = signedFileToBlob(signedFile);
	let extension = signedFile.name.split('.').at(-1)!;
	if (signature.type == SignaturesTypeOptions.jades) extension = 'jwt';
	const fileName = `${signature.title}.${extension}`;
	downloadBlob(fileBlob, fileName);
}

/* */

export async function validateSignedFile(signedFile: SignedFile) {
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
