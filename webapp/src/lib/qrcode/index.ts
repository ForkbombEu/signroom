// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import qrcode from 'qrcode-generator';

type CredentialConfig = {
	credential_configuration_ids: string[];
	credential_issuer: string;
};

export function createIntentUrl(data: CredentialConfig): string {
	const credentialConfigurationIds = encodeURIComponent(
		data.credential_configuration_ids.join(',')
	);
	const credentialIssuer = encodeURIComponent(data.credential_issuer);
	return `DIDroom4VP://?credential_configuration_ids=${credentialConfigurationIds}&credential_issuer=${credentialIssuer}`;
}

export function generateQr(text: string, cellSize = 20) {
	const qr = qrcode(0, 'L');
	qr.addData(text);
	qr.make();
	return qr.createDataURL(cellSize);
}
