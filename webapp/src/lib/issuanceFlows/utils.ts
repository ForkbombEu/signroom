// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Expiration, ExpirationDuration, ExpirationDate } from './expiration';
import { generateQr } from '$lib/qrcode';

//

export function expirationDataToTime(expirationData: Expiration): number {
	switch (expirationData.mode) {
		case 'date':
			return expirationDataToDate(expirationData);
		case 'duration':
			return expirationDataToDuration(expirationData);
	}
}

function expirationDataToDuration(expiration: ExpirationDuration): number {
	const DAY = 60 * 60 * 24;
	const MONTH = DAY * 30;
	const YEAR = MONTH * 12;
	return (
		expiration.duration.years * YEAR +
		expiration.duration.months * MONTH +
		expiration.duration.days * DAY
	);
}

function expirationDataToDate(expiration: ExpirationDate): number {
	return expiration.date;
}

//

export function unixNow() {
	return Math.floor(Date.now() / 1000);
}

//

type CredentialConfig = {
	credential_configuration_ids: string[];
	credential_issuer: string;
	grants: {
		authorization_code: {
			authorization_server: string;
		};
	};
};

function createIntentUrl(data: CredentialConfig): string {
	const credentialOffer = encodeURIComponent(JSON.stringify(data));
	return `openid-credential-offer://?credential_offer=${credentialOffer}`;
}

export function generateIssuanceFlowQr(data: {
	type_name: string;
	credential_issuer_url: string;
	authorization_server_url: string;
}) {
	return generateQr(
		createIntentUrl({
			credential_configuration_ids: [data.type_name],
			credential_issuer: data.credential_issuer_url,
			grants: {
				authorization_code: {
					authorization_server: data.authorization_server_url
				}
			}
		})
	);
}
