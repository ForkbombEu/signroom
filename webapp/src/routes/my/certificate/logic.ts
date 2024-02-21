import { fromBER } from 'asn1js';
import { X509Certificate } from '@peculiar/x509';
import { zencode_exec } from 'zenroom';
import { pb } from '$lib/pocketbase';

const converter: Record<string, string> = {
	ECDSA: `Given I have a 'hex' named 'key'
		Then print the 'key' as 'base64'`,
	EdDSA: `Given I have a 'hex' named 'key'
		Then print the 'key' as 'base58'`
};
// TODO: check all possible RSA identifier that can be used
const algorithmIdentifier: Record<string, string> = {
	'1.2.840.10045.3.1.7': 'ECDSA',
	'1.3.101.112': 'EdDSA',
	'1.2.840.113549.1.1.1': 'RSASSA-PKCS1-v1_5',
	'1.2.840.113549.1.1.10': '1.2.840.113549.1.1.10'
}
const BEGIN_CERTIFICATE = '-----BEGIN CERTIFICATE-----';
const END_CERTIFICATE = '-----END CERTIFICATE-----';
const BEGIN_KEY = '-----BEGIN PRIVATE KEY-----';
const END_KEY = '-----END PRIVATE KEY-----';
const BEGIN_EC = '-----BEGIN EC PRIVATE KEY-----';
const END_EC = '-----END EC PRIVATE KEY-----';
const OBJECT_IDENTIFIER = 'OBJECT IDENTIFIER : ';

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

function mathcKeyCertAlgo(algorithmName: string, arr: any[]) {
	var id;
	for (const v of arr) {
		const index = v.toString().indexOf(OBJECT_IDENTIFIER);
		if(index != -1) {
			id = v.toString().slice(index+OBJECT_IDENTIFIER.length).split('\n')[0];
			break;
		}
	}
	if(!id) throw('Key has no object identifier')
	if(!algorithmIdentifier[id]) throw('Algorithm not supported')
	if(algorithmIdentifier[id] != algorithmName)
		throw('Key algorithm does not correspond to certificate algorithm')
}

async function decodeKey(algorithmName: string, secretKey: string): Promise<string | null> {
	const sk = checkKey(secretKey);
	const buf = Uint8Array.from(atob(sk), (c) => c.charCodeAt(0));
	const obj: any = fromBER(buf).valueOf();
	const arr = obj.result.valueBlock.value;
	mathcKeyCertAlgo(algorithmName, arr);
	if (algorithmName == 'RSASSA-PKCS1-v1_5' || algorithmName == '1.2.840.113549.1.1.10')
		return null;
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

export async function addKey(name: string, algorithm: string, key: string, checkCert: boolean) {
	if(checkCert) {
		let certificateFound;
		try {
			await pb.collection('certificates').getFirstListItem(`name="${name}"`);
			certificateFound = true;
		} catch(e) {
			certificateFound = false;
		}
		if(certificateFound) {
			throw('Name already in use for certificate');
		}
	}
	const allKeys = readKeyFromLocalStorage();
	if (allKeys[name]) throw 'Name already in use';
	allKeys[name] = {
		value: key
	};
	const sk = await decodeKey(algorithm, key);
	if (sk) allKeys[name].zenroomValue = sk;
	localStorage.setItem('certificateKey', JSON.stringify(allKeys));
}

export async function addCertifcateAndKey(name: string, certificate: string, key: string, userId: string) {
	const { parsedCertificate, signatureAlgorithmName } = await checkCertificate(certificate);
	await addKey(name, signatureAlgorithmName, key, true);
	const c = {
		name,
		value: parsedCertificate,
		algorithm: signatureAlgorithmName,
		owner: userId
	};
	try {
		await pb.collection('certificates').create(c);
	} catch (e) {
		throw e;
	}
	location.reload();
}

