// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

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
		certificate.algorithm as AlgorithmName,
		certificate.hexPk
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
	const certPk = new x509.X509Certificate(parsedCertificate).publicKey;
	const certAlg = certPk.algorithm as EcKeyAlgorithm; // TODO - Check if interface is okay
	const signatureAlgorithmName = certAlg.name;
	// retrieve hex public key
	const res = decodeAsn1(certPk.rawData)
	const octetString = res.valueBlock.value[1];
	let hexPk = octetString.valueBlock.toJSON().valueHex;
	// pk can be in SEC format for ECDSA: 04 indicates uncompressed key
	if (signatureAlgorithmName == 'ECDSA') {
		hexPk = hexPk.replace(/^04/, '');
	}

	// TODO – Review this check
	if (signatureAlgorithmName == 'ECDSA' && certAlg.namedCurve != 'P-256') {
		throw new Error('ECDSA signature must be on P-256 curve');
	}
	if (signatureAlgorithmName == 'EdDSA' && certAlg.namedCurve != 'Ed25519') {
		throw new Error('EdDSA signature must be on Ed25519 curve');
	}
	// signatureAlgorithmName = RSASSA-PKCS1-v1_5
	// signatureAlgorithmName = 1.2.840.113549.1.1.10 (RSA-PSS)

	return { value: parsedCertificate, algorithm: signatureAlgorithmName as AlgorithmName, hexPk };
}

// Key

async function parseCertificateKey(
	key: string,
	algorithmName: AlgorithmName,
	hexPk: string
): Promise<CertificateKey> {
	return {
		value: key,
		zenroomValue: await decodeKey(algorithmName, key, hexPk)
	};
}
/*
ASN.1 structure for PKCS#8 private key:
	SEQUENCE {
		INTEGER (version, 0),
		SEQUENCE {
			OBJECT IDENTIFIER (algorithm, e.g., rsaEncryption, id-ecPublicKey),
			OPTIONAL (algorithm parameters, e.g., curve OID for EC)
		},
		OCTET STRING (private key data)
	}
private key data is:
* raw data in DER format for ED25519
* ASN.1 structure for EC PRIVATE KEY for ECDSA:
	SEQUENCE {
		INTEGER (version, typically 1),
		OCTET STRING (private key value),
		[0] {
			OBJECT IDENTIFIER (optional curve parameters, like secp256r1),
		},
		[1] {
			BIT STRING (optional public key)
		}
	}
* RSA ?
*/
async function decodeKey(algorithmName: AlgorithmName, secretKey: string, hexPk: string) {
	if (algorithmName == 'RSASSA-PKCS1-v1_5' || algorithmName == '1.2.840.113549.1.1.10')
		// TODO: verify also RSA
		return undefined;
	const sk = parseKey(secretKey);
	const buf = Uint8Array.from(atob(sk), (c) => c.charCodeAt(0));
	// decode PKCS#8
	const res = decodeAsn1(buf);
	const sequence = res.valueBlock.value
	// algorithm id is in second postion
	if (!checkKeyAlgorithm(algorithmName, sequence[1].valueBlock.value)) {
		throw new Error('Secret key algorithm does not match the certificate algorithm');
	}
	// private key information is in third position
	let innerOctetString;
	const innerRes = decodeAsn1(sequence[2].valueBlock.valueHex);
	if (algorithmName == 'ECDSA') {
		// ECDSA structure is more complex and need a to extract info
		// from the inner structure
		innerOctetString = innerRes.valueBlock.value[1];
	} else {
		innerOctetString = innerRes;
	}
	// Extract the actual private key value
	const hexKey = innerOctetString.valueBlock.toJSON().valueHex;
	// match secret key and public key
	const zenroomKey = await matchSkPk(hexKey, hexPk, algorithmName);
	if (!zenroomKey) {
		throw new Error('Invalid secret key: it does not match the certificate public key');
	}

	return zenroomKey as string;
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

function checkKeyAlgorithm(algorithmName: string, value: string[]) {
	const ids = value.map((v) => v.getValue());
	if (algorithmName == 'ECDSA') {
		return ids[0] == '1.2.840.10045.2.1' && ids[1] == '1.2.840.10045.3.1.7';
	} else if (algorithmName == 'Ed25519') {
		return ids[0] == '1.3.101.112';
	}
	return false;
}

// asn1 decode
function decodeAsn1(buf: unit8Array) {
	const asn1 = fromBER(buf);
	if (asn1.offset === -1) {
		throw new Error("Error parsing ASN.1 structure");
	}
	return asn1.result;
}

const ZENCODE_PK_GENERATORS: Partial<Record<AlgorithmName, string>> = {
	ECDSA: `
		Scenario 'es256': generate pk
		Given I have a 'hex' named 'sk'
		Given I have a 'hex' named 'pk'
		When I create the es256 key with secret 'sk'
		When I create the es256 public key
		When I verify 'es256 public key' is equal to 'pk'
		When I pickup from path 'keyring.es256'
		When I rename 'es256' to 'key'
		Then print the 'key' as 'base64'
		`,
	Ed25519: `
		Scenario 'eddsa': generate pk
		Given I have a 'hex' named 'sk'
		Given I have a 'hex' named 'pk'
		When I create the eddsa key with secret 'sk'
		When I create the eddsa public key
		When I verify 'eddsa public key' is equal to 'pk'
		When I pickup from path 'keyring.eddsa'
		When I rename 'eddsa' to 'key'
		Then print the 'key' as 'base58'
		`
};

// match a sk with a pk
export async function matchSkPk(sk: string, hexPk: string, algorithmName: AlgorithmName) {
	try {
		const { result } = await zencode_exec(
			ZENCODE_PK_GENERATORS[algorithmName],
			{
				data: `{"sk": "${sk}", "pk": "${hexPk}"}`
			});
		return JSON.parse(result).key;
	} catch (e) {
		console.error(e);
		return null;
	}
}