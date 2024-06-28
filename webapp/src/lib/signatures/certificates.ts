import * as x509 from '@peculiar/x509';
import { pb } from '$lib/pocketbase';
import { zencode_exec } from 'zenroom';
import { fromBER } from 'asn1js';

//

type Certificate = {
	value: string;
	algorithm: string;
};

type CertificateKey = {
	value: string;
	zenroomValue?: string;
};

export type CertificateData = {
	certifcate: Certificate;
	key: CertificateKey;
};

type Certificates = Record<string, CertificateData>;

//

const CERTIFICATE_KEY = 'certificateKey';
const CERTIFICATES = 'certificates';
const ALGORITHM = {
	name: 'ECDSA',
	namedCurve: 'P-256',
	hash: 'SHA-256'
};
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
};
const BEGIN_CERTIFICATE = '-----BEGIN CERTIFICATE-----';
const END_CERTIFICATE = '-----END CERTIFICATE-----';
const BEGIN_KEY = '-----BEGIN PRIVATE KEY-----';
const END_KEY = '-----END PRIVATE KEY-----';
const BEGIN_EC = '-----BEGIN EC PRIVATE KEY-----';
const END_EC = '-----END EC PRIVATE KEY-----';
const OBJECT_IDENTIFIER = 'OBJECT IDENTIFIER : ';

function url64ToBase64(input: string): string {
	// Replace non-url compatible chars with base64 standard chars
	input = input.replace(/-/g, '+').replace(/_/g, '/');

	// Pad out with standard base64 required padding characters
	var pad = input.length % 4;
	if (pad) {
		if (pad === 1) {
			throw new Error(
				'InvalidLengthError: Input base64url string is the wrong length to determine padding'
			);
		}
		input += new Array(5 - pad).join('=');
	}
	return input;
}

async function checkCertificate(certificate: string) {
	if (!certificate.startsWith(BEGIN_CERTIFICATE) || !certificate.endsWith(END_CERTIFICATE)) {
		throw new Error('Invalid ceritifcate: must be in pem format');
	}
	const parsedCertificate = certificate.split('\n').slice(1, -1).join('');
	const certAlg: { name: string; namedCurve?: string } = new x509.X509Certificate(parsedCertificate)
		.publicKey.algorithm;
	const signatureAlgorithmName = certAlg.name;
	if (signatureAlgorithmName == 'ECDSA' && certAlg.namedCurve != 'P-256') {
		throw new Error('ECDSA signature must be on P-256 curve');
	}
	if (signatureAlgorithmName == 'EdDSA' && certAlg.namedCurve != 'Ed25519') {
		throw new Error('EdDSA signature must be on Ed25519 curve');
	}
	// signatureAlgorithmName = RSASSA-PKCS1-v1_5
	// signatureAlgorithmName = 1.2.840.113549.1.1.10 (RSA-PSS)
	return { parsedCertificate, signatureAlgorithmName };
}

function checkKey(secretKey: string): string {
	let begin = secretKey.indexOf(BEGIN_KEY);
	let end;
	if (begin != -1) {
		begin += BEGIN_KEY.length;
		end = secretKey.indexOf(END_KEY);
	} else {
		begin = secretKey.indexOf(BEGIN_EC);
		if (begin != -1) begin += BEGIN_EC.length;
		end = secretKey.indexOf(END_EC);
	}
	if (end <= begin) throw new Error('Invalid key: must be in pkcs8 format');
	return secretKey.slice(begin, end).split('\n').join('');
}

function mathcKeyCertAlgo(algorithmName: string, arr: string[]) {
	let id;
	for (const v of arr) {
		const index = v.toString().indexOf(OBJECT_IDENTIFIER);
		if (index != -1) {
			id = v
				.toString()
				.slice(index + OBJECT_IDENTIFIER.length)
				.split('\n')[0];
			break;
		}
	}
	if (!id) throw new Error('Key has no object identifier');
	if (!algorithmIdentifier[id]) throw new Error('Algorithm not supported');
	if (algorithmIdentifier[id] != algorithmName)
		throw new Error('Key algorithm does not correspond to certificate algorithm');
}

async function decodeKey(algorithmName: string, secretKey: string): Promise<string | null> {
	const sk = checkKey(secretKey);
	const buf = Uint8Array.from(atob(sk), (c) => c.charCodeAt(0));
	const obj = fromBER(buf).valueOf();
	// @ts-expect-error The shape of the object is unkown
	const arr = obj.result.valueBlock.value;
	mathcKeyCertAlgo(algorithmName, arr);
	if (algorithmName == 'RSASSA-PKCS1-v1_5' || algorithmName == '1.2.840.113549.1.1.10') return null;
	const hexKey = arr
		// @ts-expect-error NAME property actually exists
		.find((value: unknown[]) => value.constructor.NAME == 'OCTET STRING')
		.toString()
		.replace(/OCTET STRING :/g, '')
		.trim();
	const { result } = await zencode_exec(converter[algorithmName], {
		data: `{"key": "${hexKey}"}`
	});
	return JSON.parse(result).key;
}

async function freeName(name: string, allKeys: Record<string, unknown>, checkCert: boolean) {
	if (checkCert) {
		let certificateFound;
		try {
			await pb.collection(CERTIFICATES).getFirstListItem(`name="${name}"`);
			certificateFound = true;
		} catch (e) {
			certificateFound = false;
		}
		if (certificateFound) {
			throw new Error('Name already in use for certificate');
		}
	}
	if (allKeys[name]) throw new Error('Name already in use');
}

export function readKeyFromLocalStorage() {
	return JSON.parse(localStorage.getItem(CERTIFICATE_KEY) || '{}');
}

// -> Certificates
export function readCertificatesFromLocalStorage(): Certificates {
	return JSON.parse(localStorage.getItem(CERTIFICATES) || '{}');
}

async function addCertifcate(
	name: string,
	value: { value: string; algorithm: string },
	owner: string
) {
	const allCerts = readCertificatesFromLocalStorage();
	allCerts[name] = value;
	localStorage.setItem(CERTIFICATES, JSON.stringify(allCerts));
	await pb.collection(CERTIFICATES).create({ name, owner });
}

export async function addKey(name: string, algorithm: string, key: string, checkCert: boolean) {
	const allKeys = readKeyFromLocalStorage();
	await freeName(name, allKeys, checkCert);
	allKeys[name] = {
		value: key
	};
	const sk = await decodeKey(algorithm, key);
	if (sk) allKeys[name].zenroomValue = sk;
	localStorage.setItem(CERTIFICATE_KEY, JSON.stringify(allKeys));
}

export async function addCertifcateAndKey(
	name: string,
	certificate: string,
	key: string,
	userId: string
) {
	const { parsedCertificate, signatureAlgorithmName } = await checkCertificate(certificate);
	await addKey(name, signatureAlgorithmName, key, true);
	await addCertifcate(
		name,
		{ value: parsedCertificate, algorithm: signatureAlgorithmName },
		userId
	);
}

export async function addAutosingedCertificateAndKey(name: string, userId: string) {
	// generating keypair
	const keyPair = await crypto.subtle.generateKey(ALGORITHM, true, ['sign', 'verify']);
	// storing the sk in local storage
	const sk = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
	const sk_b64 = btoa(String.fromCharCode(...new Uint8Array(sk))).replace(/.{64}/g, '$&\n');
	const completeKey =
		'-----BEGIN EC PRIVATE KEY-----\n' + sk_b64 + '\n-----END EC PRIVATE KEY-----';
	// raw key to be used in zenroom
	const sk_jwk = await crypto.subtle.exportKey('jwk', keyPair.privateKey);
	if (!sk_jwk.d) throw new Error('Undefined sk_jwk.d');
	const allKeys = readKeyFromLocalStorage();
	await freeName(name, allKeys, true);
	allKeys[name] = {
		value: completeKey,
		zenroomValue: url64ToBase64(sk_jwk.d)
	};
	localStorage.setItem(CERTIFICATE_KEY, JSON.stringify(allKeys));
	// compute date for certificate,
	// valid from yesterday for an year
	var yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	var year = new Date();
	year.setFullYear(yesterday.getFullYear() + 1);
	// certificate
	const cert = await x509.X509CertificateGenerator.createSelfSigned({
		serialNumber: '01',
		name: 'CN=Test',
		notBefore: yesterday,
		notAfter: year,
		signingAlgorithm: ALGORITHM,
		keys: keyPair,
		extensions: [
			new x509.BasicConstraintsExtension(true, 2, true),
			new x509.ExtendedKeyUsageExtension(['1.2.3.4.5.6.7', '2.3.4.5.6.7.8'], true),
			new x509.KeyUsagesExtension(
				x509.KeyUsageFlags.keyCertSign | x509.KeyUsageFlags.cRLSign,
				true
			),
			await x509.SubjectKeyIdentifierExtension.create(keyPair.publicKey)
		]
	});
	const parsedCert = cert.toString('pem').split('\n').slice(1, -1).join('');
	addCertifcate(name, { value: parsedCert, algorithm: 'ECDSA' }, userId);
}
