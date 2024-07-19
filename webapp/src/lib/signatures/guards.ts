// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { CertificateData } from '$lib/certificates/types';
import { SignaturesTypeOptions } from '$lib/pocketbase/types';
import { algorithmIdentifiers as algos } from '$lib/certificates/types';

export function isInvalidCertificate(
	signatureType: SignaturesTypeOptions,
	certificateData: CertificateData
) {
	const isJadesSignature = signatureType == SignaturesTypeOptions.jades;
	const certificateAlgorithm = certificateData.certificate.algorithm;
	const isEddsaCertificate = certificateAlgorithm == algos['1.3.101.112'];
	const isEcdsaCertificate = certificateAlgorithm == algos['1.2.840.10045.3.1.7'];
	return isJadesSignature && (isEddsaCertificate || isEcdsaCertificate);
}
