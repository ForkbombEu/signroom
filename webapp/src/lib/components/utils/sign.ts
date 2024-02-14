import hexDerEs256Signature from '../../../../zenflows-crypto/src/hex_der_es256_signature.zen?raw';
import EdDSASignature from '../../../../zenflows-crypto/src/eddsa_signature.zen?raw';
import { fromBER } from 'asn1js';
import { zencode_exec } from 'zenroom';
import forge from 'node-forge';

async function zencodeExec(contract: string, data: string) {
	const { result } = await zencode_exec(contract, {data: data});
	return JSON.parse(result);
}
// TODO: move at upload time
const converter = {
	ECDSA: `Given I have a 'hex' named 'key'
	Then print the 'key' as 'base64'`,
	EdDSA: `Given I have a 'hex' named 'key'
	Then print the 'key' as 'base58'`
}
// TODO: move at upload time
async function decodeKey(algorithmName: string, secretKey:string): string {
	if (algorithmName == 'RSA') return secretKey;
	const buf = Uint8Array.from(atob(secretKey), c => c.charCodeAt(0));
	const arr = fromBER(buf).result.valueBlock.value;
	const hexKey = arr.find((value) => value.constructor.name == '_OctetString').toString().replace(/OCTET STRING :/g, '').trim();
	const { key } = await zencodeExec(converter[algorithmName], `{"key": "${hexKey}"}`);
	return key;
}

export async function signData(algorithmName: string, secretKey: string, data: string): string {
	// this will be remove as soon as above part is moved to upload time
	const sk = await decodeKey(algorithmName, secretKey);
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
			return btoa(privateKey.sign(md));
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
			return btoa(privateKey.sign(md, pss));
			break;
		default:
			throw(algorithmName + '  not yet implemented')
	}
}