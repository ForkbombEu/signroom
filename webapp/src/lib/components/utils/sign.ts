import hexDerEs256Signature from '../../../../zenflows-crypto/src/hex_der_es256_signature.zen?raw';
import EdDSASignature from '../../../../zenflows-crypto/src/eddsa_signature.zen?raw';
import { zencode_exec } from 'zenroom';
import forge from 'node-forge';
import { pb } from '$lib/pocketbase';
import type { CertificatesResponse, SignaturesResponse } from '$lib/pocketbase/types';

//

async function zencodeExec(contract: string, data: string) {
	const { result } = await zencode_exec(contract, { data: data });
	return JSON.parse(result);
}

//

export async function signData(algorithmName: string, sk: string, data: string): Promise<string> {
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

//

export async function signFile(record: SignaturesResponse) {
	const algo = record.type;
	const url = pb.files.getUrl(record, record.file);
	//get the file to sign
	const res = await fetch(url);
	const blob = await res.blob();

	const fb64: string = await new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(blob);
		reader.onerror = (e) => {
			reject(e);
		};
		reader.onload = () => {
			resolve((reader.result as string).split(',')[1]);
		};
	});

	console.log(fb64);

	const cert = await pb.collection('certificates').getOne<CertificatesResponse>(record.certificate);
	const name = cert.name;
	const certPem = cert.value;
	const signatureAlgorithmName = cert.algorithm;
	// current timestamp
	const ts_now = Date.now();
	const sk = JSON.parse(localStorage.getItem('certificateKey') || '{}');
	if (sk[name] == null) throw 'Empty secret key';
	const secretKey = sk[name].zenroomValue || sk[name].value;

	//2. get data to sign
	const toSign = await fetch('/api/getDataToSign', {
		method: 'POST',
		body: JSON.stringify({ certPem, ts_now, algo, doc: fb64, signatureAlgorithmName }),
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	});
	const toBeSigned = await toSign.json();

	//3. sign digest of data
	const signedDigest = await signData(signatureAlgorithmName, secretKey, toBeSigned.bytes);

	//4. sign document (insert signature)
	const signed = await fetch('/api/signDocument', {
		method: 'POST',
		body: JSON.stringify({
			certPem,
			ts_now,
			algo,
			doc: fb64,
			signatureAlgorithmName,
			signedDigest
		}),
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	});
	const signedDocument = await signed.json();

	//5. save signed document to db
	const formData = new FormData();
	formData.append('signed_file', JSON.stringify(signedDocument));
	await pb.collection('signatures').update(record.id, formData);
}
