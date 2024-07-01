import { lookup } from 'mrmime';
import type { Signature, SignedFile } from './types';
import { SignaturesTypeOptions } from '$lib/pocketbase/types';
import { downloadBlob } from '$lib/utils/clientFileDownload';
import { Buffer } from 'buffer';

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
