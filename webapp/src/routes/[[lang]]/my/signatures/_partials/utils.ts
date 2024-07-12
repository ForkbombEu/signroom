// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { getCertificatesFromLocalStorage } from '$lib/certificates/storage';
import type { SignaturesTypeOptions } from '$lib/pocketbase/types';
import { isInvalidCertificate } from '$lib/signatures/guards';

export function getInvalidCertificates(signatureType: SignaturesTypeOptions) {
	return Object.entries(getCertificatesFromLocalStorage())
		.filter(([_, certificateData]) => isInvalidCertificate(signatureType, certificateData))
		.map(([certificateName, _]) => certificateName);
}
