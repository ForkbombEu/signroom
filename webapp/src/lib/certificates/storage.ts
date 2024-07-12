// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { pipe, Record, Option } from 'effect';
import { CertificatesSchema, type Certificates, type CertificateData } from './types';
import { browser } from '$app/environment';
import { pb } from '$lib/pocketbase';
import type { CertificatesRecord } from '$lib/pocketbase/types';

//

const CERTIFICATES_LS_KEY = 'certificates';

//

export function getCertificatesFromLocalStorage(): Certificates {
	if (!browser) throw new Error('readCertificatesFromLocalStorage must be run in the browser');
	return pipe(
		localStorage.getItem(CERTIFICATES_LS_KEY) || '{}',
		JSON.parse,
		CertificatesSchema.parse
	);
}

function setCertificatesInLocalStorage(certificates: Certificates) {
	if (!browser) throw new Error('saveCertificatesInLocalStorage must be run in the browser');
	localStorage.setItem(CERTIFICATES_LS_KEY, JSON.stringify(certificates));
}

export function removeCertificatesInLocalStorage() {
	localStorage.removeItem(CERTIFICATES_LS_KEY);
}

//

export async function saveCertificate(
	name: string,
	certificateData: CertificateData,
	owner: string
) {
	await checkCertificateNameAvailability(name);
	await saveCertificateInDb(name, owner);
	saveCertificateInLocalStorage(name, certificateData);
}

async function saveCertificateInDb(name: string, owner: string) {
	pb.collection('certificates').create({ name, owner } satisfies CertificatesRecord);
}

export function saveCertificateInLocalStorage(name: string, ceritifcateData: CertificateData) {
	const certificates = getCertificatesFromLocalStorage();
	certificates[name] = ceritifcateData;
	setCertificatesInLocalStorage(certificates);
}

export function deleteCertificateInLocalStorage(name: string) {
	const certificates = getCertificatesFromLocalStorage();
	setCertificatesInLocalStorage(Record.remove(certificates, name));
}

export function isCertificateInLocalStorage(name: string) {
	const certificates = getCertificatesFromLocalStorage();
	return Boolean(certificates[name]);
}

export function getCertificate(name: string) {
	return pipe(getCertificatesFromLocalStorage(), Record.get(name), Option.getOrThrow);
}

//

export async function checkCertificateNameAvailability(name: string) {
	const dbCheck = await isCertificateNameAvailableInDb(name);
	const lsCheck = isCertificateNameAvailableInLocalStorage(name);
	if (dbCheck && lsCheck) throw new Error('Name already in use for certificate');
}

async function isCertificateNameAvailableInDb(name: string) {
	try {
		await pb.collection('certificates').getFirstListItem(`name="${name}"`);
		return true;
	} catch (e) {
		return false;
	}
}

function isCertificateNameAvailableInLocalStorage(name: string) {
	return Boolean(getCertificatesFromLocalStorage()[name]);
}
