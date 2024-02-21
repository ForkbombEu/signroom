import { fromBER } from 'asn1js';
import { X509Certificate } from '@peculiar/x509';
import { zencode_exec } from 'zenroom';
import { pb, currentUser } from '$lib/pocketbase';

const converter: Record<string, string> = {
	ECDSA: `Given I have a 'hex' named 'key'
		Then print the 'key' as 'base64'`,
	EdDSA: `Given I have a 'hex' named 'key'
		Then print the 'key' as 'base58'`
};
const BEGIN_CERTIFICATE = '-----BEGIN CERTIFICATE-----';
const END_CERTIFICATE = '-----END CERTIFICATE-----';
const BEGIN_KEY = '-----BEGIN PRIVATE KEY-----';
const END_KEY = '-----END PRIVATE KEY-----';
const BEGIN_EC = '-----BEGIN EC PRIVATE KEY-----';
const END_EC = '-----END EC PRIVATE KEY-----';

export function readKeyFromLocalStorage(){
	return JSON.parse(localStorage.getItem('certificateKey') || '{}');
}

async function checkCertificate(certificate: string) {
	if (!certificate.startsWith(BEGIN_CERTIFICATE) || !certificate.endsWith(END_CERTIFICATE)) {
		throw 'Invalid ceritifcate: must be in pem format';
	}
	const parsedCertificate = certificate.split('\n').slice(1, -1).join('');
	const certAlg: { name: string; namedCurve?: string } = new X509Certificate(parsedCertificate)
		.publicKey.algorithm;
	const signatureAlgorithmName = certAlg.name;
	if (signatureAlgorithmName == 'ECDSA' && certAlg.namedCurve != 'P-256') {
		throw 'ECDSA signature must be on P-256 curve';
	}
	if (signatureAlgorithmName == 'EdDSA' && certAlg.namedCurve != 'Ed25519') {
		throw 'EdDSA signature must be on Ed25519 curve';
	}
	// signatureAlgorithmName = RSASSA-PKCS1-v1_5
	// signatureAlgorithmName = 1.2.840.113549.1.1.10 (RSA-PSS)
	return { parsedCertificate, signatureAlgorithmName };
}

function checkKey(secretKey: string): string {
	var begin = secretKey.indexOf(BEGIN_KEY);
	var end;
	if (begin != -1) {
		begin += BEGIN_KEY.length;
		end = secretKey.indexOf(END_KEY);
	} else {
		begin = secretKey.indexOf(BEGIN_EC);
		if (begin != -1) begin += BEGIN_EC.length;
		end = secretKey.indexOf(END_EC);
	}
	if (end <= begin) throw 'Invalid key: must be in pkcs8 format';
	return secretKey.slice(begin, end).split('\n').join('');
}

async function decodeKey(algorithmName: string, secretKey: string): Promise<string | null> {
	const sk = checkKey(secretKey);
	if (algorithmName == 'RSASSA-PKCS1-v1_5' || algorithmName == '1.2.840.113549.1.1.10')
		return null;
	const buf = Uint8Array.from(atob(sk), (c) => c.charCodeAt(0));
	const obj: any = fromBER(buf).valueOf();
	const arr = obj.result.valueBlock.value;
	const hexKey = arr
		.find((value: any[]) => value.constructor.name == '_OctetString')
		.toString()
		.replace(/OCTET STRING :/g, '')
		.trim();
	const { result } = await zencode_exec(converter[algorithmName], {
		data: `{"key": "${hexKey}"}`
	});
	return JSON.parse(result).key;
}

export async function addCertifcateAndKey(name: string, certificate: string, key: string) {
	const allKeys = readKeyFromLocalStorage();
	if (allKeys[name]) throw 'Certificate name already in use';
	const { parsedCertificate, signatureAlgorithmName } = await checkCertificate(certificate);
	const c = {
		name,
		value: parsedCertificate,
		algorithm: signatureAlgorithmName,
		owner: $currentUser!.id
	};
	try {
		await pb.collection('certificates').create(c);
	} catch (e) {
		throw e;
	}
	const sk = await decodeKey(signatureAlgorithmName, key);
	allKeys[name] = {
		value: key
	};
	if (sk) allKeys[name].zenroomValue = sk;
	localStorage.setItem('certificateKey', JSON.stringify(allKeys));
	location.reload();
}
