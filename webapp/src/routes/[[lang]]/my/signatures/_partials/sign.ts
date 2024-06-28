import { pb } from '$lib/pocketbase';
import type { SignaturesTypeOptions } from '$lib/pocketbase/types';
import EdDSASignature from '@zenflows-crypto/src/eddsa_signature.zen?raw';
import hexDerEs256Signature from '@zenflows-crypto/src/hex_der_es256_signature.zen?raw';
import forge from 'node-forge';
import { serialize } from 'object-to-formdata';
import { zencode_exec } from 'zenroom';
import type { SignatureFormData } from './signatureFormUtils';
import { readFileAsBase64 } from '$lib/utils/files';
import type { CertificateData } from '$lib/signatures/certificates';

//

export async function signFileAndUpload(data: SignatureFormData, certificateData: CertificateData) {
	const base64file = await readFileAsBase64(data.file);
	const signedFile = await signFile(data.type, base64file, certificateData);
	return await storeSignature(data, signedFile);
}

// 2. Sign file

async function signFile(
	algo: SignaturesTypeOptions,
	base64file: string,
	certificateData: CertificateData
): Promise<SignedFile> {
	const certPem = certificateData.certificate.value;
	const signatureAlgorithmName = certificateData.certificate.algorithm;
	const secretKey = certificateData.key.zenroomValue ?? certificateData.key.value;

	// Current timestamp
	const ts_now = Date.now();

	// 2. get data to sign
	const toSign = await fetch('/api/getDataToSign', {
		method: 'POST',
		body: JSON.stringify({ certPem, ts_now, algo, doc: base64file, signatureAlgorithmName }),
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	});
	const toBeSigned = await toSign.json();

	// 3. sign digest of data
	const signedDigest = await signData(signatureAlgorithmName, secretKey, toBeSigned.bytes);

	// 4. sign document (insert signature)
	const signed = await fetch('/api/signDocument', {
		method: 'POST',
		body: JSON.stringify({
			certPem,
			ts_now,
			algo,
			doc: base64file,
			signatureAlgorithmName,
			signedDigest
		}),
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	});

	return (await signed.json()) as SignedFile;
}

async function signData(algorithmName: string, sk: string, data: string): Promise<string> {
	switch (algorithmName) {
		case 'ECDSA': {
			const { der_signature } = await zencodeExec(
				hexDerEs256Signature,
				`{"keyring": {"es256": "${sk}"}, "bytes": "${data}"}`
			);
			const signedDigest = btoa(
				der_signature
					.match(/\w{2}/g)
					.map(function (a: string) {
						return String.fromCharCode(parseInt(a, 16));
					})
					.join('')
			);
			return signedDigest;
		}
		case 'EdDSA': {
			const { eddsa_signature } = await zencodeExec(
				EdDSASignature,
				`{"keyring": {"eddsa": "${sk}"}, "bytes": "${data}"}`
			);
			return eddsa_signature;
		}
		case 'RSASSA-PKCS1-v1_5': {
			// sk needs to be Pem, i.e.
			// -----BEGIN PRIVATE KEY-----\nbase64\n-----END PRIVATE KEY-----
			const pkcs1PrivateKey = forge.pki.privateKeyFromPem(sk);
			const md = forge.md.sha256.create();
			md.update(atob(data), 'raw');
			return btoa(pkcs1PrivateKey.sign(md));
		}
		case '1.2.840.113549.1.1.10': {
			// sk needs to be Pem, i.e.
			// -----BEGIN PRIVATE KEY-----\nbase64\n-----END PRIVATE KEY-----
			const pssPrivateKey = forge.pki.privateKeyFromPem(sk);
			const md = forge.md.sha256.create();
			md.update(atob(data), 'raw');
			const pss = forge.pss.create({
				md: forge.md.sha1.create(),
				mgf: forge.mgf.mgf1.create(forge.md.sha1.create()),
				saltLength: 20
			});
			return btoa(pssPrivateKey.sign(md, pss));
		}
		default:
			throw algorithmName + '  not yet implemented';
	}
}

// 3. Create signature record

function storeSignature(data: SignatureFormData, signedFile: SignedFile) {
	const createData = serialize({ ...data, signed_file: JSON.stringify(signedFile, null, 4) }); // TODO – Type better
	return pb.collection('signatures').create(createData);
}

// Z. Utils

async function zencodeExec(contract: string, data: string) {
	const { result } = await zencode_exec(contract, { data: data });
	return JSON.parse(result);
}

type SignedFile = Record<string, unknown>;
