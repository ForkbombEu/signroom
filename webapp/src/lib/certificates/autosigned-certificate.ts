// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import * as x509 from '@peculiar/x509';
import type { AlgorithmName, Certificate, CertificateData, CertificateKey } from './types';
import { BEGIN_EC, END_EC } from './strings';

//

const ALGORITHM: EcKeyGenParams = {
	name: 'ECDSA',
	namedCurve: 'P-256'
	// hash: 'SHA-256'
};

//

export async function createAutosignedCertificateData(username: string, did: string): Promise<CertificateData> {
	const keyPair = await generateKeyPair();
	return {
		certificate: await createAutosignedCertificate(keyPair, username, did),
		key: await createAutosignedCertificateKey(keyPair)
	};
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

async function createAutosignedCertificate(keyPair: CryptoKeyPair, username: string, did: string): Promise<Certificate> {
	// compute date for certificate, valid from yesterday for an year
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	const year = new Date();
	year.setFullYear(yesterday.getFullYear() + 1);

	// certificate
	const cert = await x509.X509CertificateGenerator.createSelfSigned({
		serialNumber: '01',
		name: 'CN=Didroom - ' + username,
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
			await x509.SubjectKeyIdentifierExtension.create(keyPair.publicKey),
			new x509.SubjectAlternativeNameExtension([{ type: 'url', value: did }])
		]
	});
	const parsedCert = cert.toString('pem').split('\n').slice(1, -1).join('');

	return {
		value: parsedCert,
		algorithm: ALGORITHM.name as AlgorithmName
	};
}

//

function generateKeyPair() {
	return crypto.subtle.generateKey(ALGORITHM, true, ['sign', 'verify']) as Promise<CryptoKeyPair>;
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
