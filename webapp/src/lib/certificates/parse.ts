// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import * as x509 from '@peculiar/x509';
import { zencode_exec } from 'zenroom';
import * as forge from 'node-forge';
import {
	BEGIN_CERTIFICATE,
	BEGIN_EC,
	BEGIN_KEY,
	END_CERTIFICATE,
	END_EC,
	END_KEY
} from './strings';
import {
	algorithmNames,
	algorithmIdentifiers,
	algorithmSupportedCurves,
	ecAlgorithmNames,
	rsaAlgorithmNames,
	type AlgorithmName,
	type Certificate,
	type CertificateKey,
	type CertificateData
} from './types';
import {
	arrayBufferToHex,
	byteStringBufferToArrayBuffer,
	decodeAsn1
} from './utils';

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
	// check algorithm
	if ( !algorithmNames.includes(certPk.algorithm.name) ) {
		throw new Error(`Unsupported algorithm: ${certPk.algorithm.name}`);
	}
	const certAlg = certPk.algorithm as AlgorithmName;
	const signatureAlgorithmName = certAlg.name;
	if ( ecAlgorithmNames.includes(signatureAlgorithmName) && algorithmSupportedCurves[signatureAlgorithmName] != certAlg.namedCurve ) {
		throw new Error(`${signatureAlgorithmName} signature must be on ${algorithmSupportedCurves[signatureAlgorithmName]} curve`);
	}

	// retrieve hex public key
	const subjectPublicKeyInfo = decodeAsn1(certPk.rawData);
	const subjectPublicKey = subjectPublicKeyInfo.valueBlock.value[1].valueBlock.valueHex;
	const hexPk = arrayBufferToHex(subjectPublicKey);

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
private key data is still asn1 encoded
*/
async function decodeKey(algorithmName: AlgorithmName, secretKey: string, hexPk: string) {
	const sk = parseKey(secretKey);
	// rsa key is checked with forge, thus secret key does not require any decode
	if ( rsaAlgorithmNames.includes(algorithmName) ) {
		await matchRsaSkPk(secretKey, hexPk, algorithmName);
		return undefined;
	}
	const buf = Uint8Array.from(atob(sk), (c) => c.charCodeAt(0));
	// decode PKCS#8
	const res = decodeAsn1(buf);
	const sequence = res.valueBlock.value;
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
	const hexKey = arrayBufferToHex(innerOctetString.valueBlock.valueHex);
	// match secret key and public key
	const zenroomKey = await matchEcSkPk(hexKey, hexPk, algorithmName);
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
	const ids = value.map((v) => v.getValue ? v.getValue() : null);
	return JSON.stringify(ids) == JSON.stringify(algorithmIdentifiers[algorithmName])
}

function matchRsaSkPk(sk: string, hexPk: string) {
	const privateKey = forge.pki.privateKeyFromPem(sk);
	const publicKey = forge.pki.setRsaPublicKey(privateKey.n, privateKey.e);
	const pemPk = forge.pki.publicKeyToAsn1(publicKey);
	const bufPk = forge.asn1.toDer(pemPk);
	const subjectPublicKeyInfo = decodeAsn1(byteStringBufferToArrayBuffer(bufPk));
	const subjectPublicKey = subjectPublicKeyInfo.valueBlock.value[1].valueBlock.valueHex;
	const hexPkFromSk = arrayBufferToHex(subjectPublicKey);
	if ( hexPkFromSk !== hexPk ) {
		throw new Error('Invalid secret key: it does not match the certificate public key')
	}
	return undefined;
}
// match a sk with a pk
const ZENCODE_PK_GENERATORS: Partial<Record<AlgorithmName, string>> = {
	ECDSA: `
		Scenario 'es256': generate pk
		Given I have a 'hex' named 'sk'
		Given I have a 'hex' named 'pk'
		# create pk
		When I create the es256 key with secret 'sk'
		When I create the es256 public key
		# add 04 at the beginning (der encoding for uncompressed key)
		When I set 'der_pk' to '04' as 'hex'
		When I append 'es256 public key' to 'der_pk'
		# check
		When I verify 'der_pk' is equal to 'pk'
		# print encoded private key
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

export async function matchEcSkPk(sk: string, hexPk: string, algorithmName: AlgorithmName) {
	try {
		const { result } = await zencode_exec(
			ZENCODE_PK_GENERATORS[algorithmName],
			{
				data: `{"sk": "${sk}", "pk": "${hexPk}"}`
			});
		return JSON.parse(result).key;
	} catch (e) {
		console.error(e);
		throw new Error('Invalid secret key: it does not match the certificate public key')
	}
}
