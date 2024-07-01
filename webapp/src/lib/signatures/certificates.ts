import * as x509 from '@peculiar/x509';
import { pb } from '$lib/pocketbase';
import { zencode_exec } from 'zenroom';
import { fromBER } from 'asn1js';
import { z } from 'zod';
import { pipe, Option as O } from 'effect';

//

const CertificateSchema = z.object({
	value: z.string(),
	algorithm: z.string()
});
type Certificate = z.infer<typeof CertificateSchema>;

const CertificateKeySchema = z.object({
	value: z.string(),
	zenroomValue: z.string().optional()
});
type CertificateKey = z.infer<typeof CertificateKeySchema>;

export const CertificateDataSchema = z.object({
	certificate: CertificateSchema,
	key: CertificateKeySchema
});
export type CertificateData = z.infer<typeof CertificateDataSchema>;

export const CertificatesSchema = z.record(CertificateDataSchema);

//

const CERTIFICATES_AND_KEY = 'certificatesAndKey';
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


/* Utility functions */

async function freeName(name: string, allCertifcatesAndKeys: Record<string, CertificateData>): Promise<void> {
	let certificateFound;
	try {
		await pb.collection(CERTIFICATES).getFirstListItem(`name="${name}"`);
		certificateFound = true;
	} catch (e) {
		certificateFound = false;
	}
	if (certificateFound) {
		throw new Error('Name already in use');
	}
	if (allCertifcatesAndKeys[name]) throw new Error('Name already in use');
}

function url64ToBase64(input: string): string {
	// Replace non-url compatible chars with base64 standard chars
	input = input.replace(/-/g, '+').replace(/_/g, '/');

	// Pad out with standard base64 required padding characters
	const pad = input.length % 4;
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

/* import user key and certificate */

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

async function createCertificateKey(algorithm: string, key: string) {
	const res = {
		value: key,
	};
	const sk = await decodeKey(algorithm, key);
	if (sk) res.zenroomValue = sk;
	return res
}

export async function addCertifcateAndKey(
	name: string,
	certificate: string,
	key: string,
	owner: string
) {
	const localData = readFromLocalStorage();
	await freeName(name, localData, true);
	const { parsedCertificate, signatureAlgorithmName } = await checkCertificate(certificate);
	localData[name] = {
		key: await createCertificateKey(signatureAlgorithmName, key),
		certificate: { parsedCertificate, signatureAlgorithmName }
	};
	localStorage.setItem(CERTIFICATES_AND_KEY, JSON.stringify(localData));
	await pb.collection(CERTIFICATES).create({ name, owner });
}

/* Certificate And Keys CRUD */

export function readFromLocalStorage() {
	return pipe(localStorage.getItem(CERTIFICATES_AND_KEY) || '{}', JSON.parse, CertificatesSchema.parse);
}

/* Autosigned certificate generation */

function generateKeyPair() {
	return crypto.subtle.generateKey(ALGORITHM, true, ['sign', 'verify']);
}

async function createAutosignedCertificateKey(keyPair: CryptoKeyPair): Promise<CertificateKey> {
	// storing the sk in local storage
	const sk = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
	const sk_b64 = btoa(String.fromCharCode(...new Uint8Array(sk))).replace(/.{64}/g, '$&\n');
	const completeKey = [BEGIN_EC, sk_b64, END_EC].join('\n');

	// raw key to be used in zenroom
	const sk_jwk = await crypto.subtle.exportKey('jwk', keyPair.privateKey);
	if (!sk_jwk.d) throw new Error('Undefined sk_jwk.d');

	return {
		value: completeKey,
		zenroomValue: url64ToBase64(sk_jwk.d)
	};
}

async function createAutosignedCertificate(keyPair: CryptoKeyPair): Promise<Certificate> {
	// compute date for certificate, valid from yesterday for an year
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	const year = new Date();
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

	return {
		value: parsedCert,
		algorithm: ALGORITHM.name
	};
}

async function createAutosignedCertificateData(): Promise<CertificateData> {
	const keyPair = await generateKeyPair();
	return {
		certificate: await createAutosignedCertificate(keyPair),
		key: await createAutosignedCertificateKey(keyPair)
	};
}

export async function addAutosingedCertificateAndKey(name: string, owner: string) {
	const localData = readFromLocalStorage();
	await freeName(name, localData, true);
	localData[name] = await createAutosignedCertificateData();
	localStorage.setItem(CERTIFICATES_AND_KEY, JSON.stringify(localData));
	await pb.collection(CERTIFICATES).create({ name, owner });
}
