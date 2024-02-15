import hexDerEs256Signature from '../../../../zenflows-crypto/src/hex_der_es256_signature.zen?raw';
import EdDSASignature from '../../../../zenflows-crypto/src/eddsa_signature.zen?raw';
import { zencode_exec } from 'zenroom';
import forge from 'node-forge';

async function zencodeExec(contract: string, data: string) {
	const { result } = await zencode_exec(contract, {data: data});
	return JSON.parse(result);
}

export async function signData(algorithmName: string, sk: string, data: string): string {
	switch(algorithmName){
		case 'ECDSA':
			const { der_signature } = await zencodeExec(hexDerEs256Signature,
				`{"keyring": {"es256": "${sk}"}, "bytes": "${data}"}`);
			const signedDigest = btoa(der_signature.match(/\w{2}/g).map(function(a: string){return String.fromCharCode(parseInt(a, 16));} ).join(""));
			return signedDigest;
			break;;
		case 'EdDSA':
			const { eddsa_signature } = await zencodeExec(EdDSASignature,
				`{"keyring": {"eddsa": "${sk}"}, "bytes": "${data}"}`);
			return eddsa_signature;
			break;
		case 'RSASSA-PKCS1-v1_5':
			// sk needs to be Pem, i.e.
			// -----BEGIN PRIVATE KEY-----\nbase64\n-----END PRIVATE KEY-----
			const pkcs1PrivateKey = forge.pki.privateKeyFromPem(sk);
			var md = forge.md.sha256.create();
			md.update(atob(data), 'raw');
			return btoa(pkcs1PrivateKey.sign(md));
			break;
		case '1.2.840.113549.1.1.10':
			// sk needs to be Pem, i.e.
			// -----BEGIN PRIVATE KEY-----\nbase64\n-----END PRIVATE KEY-----
			const pssPrivateKey = forge.pki.privateKeyFromPem(sk);
			var md = forge.md.sha256.create();
			md.update(atob(data), 'raw');
			const pss = forge.pss.create({
				md: forge.md.sha1.create(),
				mgf: forge.mgf.mgf1.create(forge.md.sha1.create()),
				saltLength: 20
			});
			return btoa(pssPrivateKey.sign(md, pss));
			break;
		default:
			throw(algorithmName + '  not yet implemented')
	}
}