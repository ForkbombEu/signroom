import * as x509 from '@peculiar/x509';
import { zencode_exec } from 'zenroom';
import { fromBER } from 'asn1js';
import {
	BEGIN_CERTIFICATE,
	BEGIN_EC,
	BEGIN_KEY,
	END_CERTIFICATE,
	END_EC,
	END_KEY,
	OBJECT_IDENTIFIER
} from './strings';
import {
	algorithmIdentifiers,
	type AlgorithmId,
	type AlgorithmName,
	type Certificate,
	type CertificateKey,
	type CertificateData
} from './types';

//

//

export async function parseCertificateData(
	ceritifcateString: string,
	keyString: string
): Promise<CertificateData> {
	const certificate = await parseCertificate(ceritifcateString);
	const ceritifcateKey = await parseCertificateKey(
		keyString,
		certificate.algorithm as AlgorithmName
	);
	return {
		certificate,
		key: ceritifcateKey
	};
}

// Certificate

async function parseCertificate(certificate: string): Promise<Certificate> {
	if (!certificate.startsWith(BEGIN_CERTIFICATE) || !certificate.endsWith(END_CERTIFICATE)) {
		throw new Error('Invalid ceritifcate: must be in pem format');
	}

	const parsedCertificate = certificate.split('\n').slice(1, -1).join('');
	const certAlg = new x509.X509Certificate(parsedCertificate).publicKey.algorithm as EcKeyAlgorithm; // TODO - Check if interface is okay
	const signatureAlgorithmName = certAlg.name;

	// TODO – Review this check
	if (signatureAlgorithmName == 'ECDSA' && certAlg.namedCurve != 'P-256') {
		throw new Error('ECDSA signature must be on P-256 curve');
	}
	if (signatureAlgorithmName == 'EdDSA' && certAlg.namedCurve != 'Ed25519') {
		throw new Error('EdDSA signature must be on Ed25519 curve');
	}
	// signatureAlgorithmName = RSASSA-PKCS1-v1_5
	// signatureAlgorithmName = 1.2.840.113549.1.1.10 (RSA-PSS)

	return { value: parsedCertificate, algorithm: signatureAlgorithmName as AlgorithmName };
}

// Key

async function parseCertificateKey(
	key: string,
	algorithmName: AlgorithmName
): Promise<CertificateKey> {
	return {
		value: key,
		zenroomValue: await decodeKey(algorithmName, key)
	};
}

const ZENCODE_KEY_CONVERTERS: Partial<Record<AlgorithmName, string>> = {
	ECDSA: `Given I have a 'hex' named 'key'
		Then print the 'key' as 'base64'`,
	Ed25519: `Given I have a 'hex' named 'key'
		Then print the 'key' as 'base58'`
};

async function decodeKey(algorithmName: AlgorithmName, secretKey: string) {
	if (algorithmName == 'RSASSA-PKCS1-v1_5' || algorithmName == '1.2.840.113549.1.1.10')
		return undefined;

	const sk = parseKey(secretKey);
	const buf = Uint8Array.from(atob(sk), (c) => c.charCodeAt(0));
	const obj = fromBER(buf).valueOf();
	// @ts-expect-error The shape of the object is unkown
	const arr = obj.result.valueBlock.value;

	matchKeyCertAlgo(algorithmName, arr);

	const hexKey = arr
		// @ts-expect-error NAME property actually exists
		.find((value: unknown[]) => value.constructor.NAME == 'OCTET STRING')
		.toString()
		.replace(/OCTET STRING :/g, '')
		.trim();

	// @ts-expect-error Type 'undefined' is not assignable to type 'string'
	const { result } = await zencode_exec(ZENCODE_KEY_CONVERTERS[algorithmName], {
		data: `{"key": "${hexKey}"}`
	});

	return JSON.parse(result).key as string;
}

function parseKey(secretKey: string): string {
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

function matchKeyCertAlgo(algorithmName: string, arr: string[]) {
	let id: AlgorithmId | undefined = undefined;
	for (const v of arr) {
		const index = v.toString().indexOf(OBJECT_IDENTIFIER);
		if (index != -1) {
			id = v
				.toString()
				.slice(index + OBJECT_IDENTIFIER.length)
				.split('\n')[0] as AlgorithmId;
			break;
		}
	}
	if (!id) throw new Error('Key has no object identifier');
	if (!algorithmIdentifiers[id]) throw new Error('Algorithm not supported');
	if (algorithmIdentifiers[id] != algorithmName)
		throw new Error('Key algorithm does not correspond to certificate algorithm');
}
