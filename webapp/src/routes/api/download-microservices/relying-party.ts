import type { IssuersResponse, RelyingPartiesResponse } from '$lib/pocketbase/types';
import AdmZip from 'adm-zip';
import type { DownloadMicroservicesRequestBody } from '.';
import { getFoldersToDelete, type WellKnown } from './shared';
import { DEFAULT_LOCALE } from './utils/locale';
import { cleanUrl } from './utils/data';
import _ from 'lodash/fp';
import { deleteZipFolder, updateZipEntryJson } from './utils/zip';

import { pipe } from 'effect';
import * as S from 'effect/String';

/* Data setup */

type RelyingPartyRelatedData = {
	credential_issuers: IssuersResponse[];
};

function getRelyingPartyRelatedDataFromRequestBody(
	body: DownloadMicroservicesRequestBody
): RelyingPartyRelatedData {
	return {
		credential_issuers: body.credential_issuers
	};
}

/* Well known editing */

function createRelyingPartyWellKnown(
	relying_party: RelyingPartiesResponse,
	relying_party_related_data: RelyingPartyRelatedData,
	default_well_known: WellKnown
): WellKnown {
	const relying_party_url = cleanUrl(relying_party.endpoint);
	const trusted_credential_issuers = relying_party_related_data.credential_issuers.map(
		(issuer) => issuer.endpoint
	);

	return pipe(
		default_well_known,

		JSON.stringify,
		S.replaceAll('https://relying-party1.zenswarm.forkbomb.eu/relying_party', relying_party_url),
		JSON.parse,

		_.set('display[0]', {
			name: relying_party.name,
			locale: DEFAULT_LOCALE
		}),
		_.set('jwks.keys[0].kid', ''),
		_.set('trusted_credential_issuers', trusted_credential_issuers)
	) as WellKnown;
}

/* Zip editing */

const RELYING_PARTY_WELL_KNOWN_PATH = 'public/relying_party/.well-known/openid-relying-party';

function editRelyingPartyWellKnown(
	zip: AdmZip,
	relying_party: RelyingPartiesResponse,
	relying_party_related_data: RelyingPartyRelatedData
) {
	updateZipEntryJson(zip, RELYING_PARTY_WELL_KNOWN_PATH, (default_well_known) =>
		createRelyingPartyWellKnown(
			relying_party,
			relying_party_related_data,
			default_well_known as WellKnown
		)
	);
}

export function createRelyingPartyZip(
	zip_buffer: Buffer,
	relying_party: RelyingPartiesResponse,
	request_body: DownloadMicroservicesRequestBody
) {
	const zip = new AdmZip(zip_buffer);

	const credential_issuer_related_data = getRelyingPartyRelatedDataFromRequestBody(request_body);

	editRelyingPartyWellKnown(zip, relying_party, credential_issuer_related_data);
	getFoldersToDelete('relying_party').forEach((path) => deleteZipFolder(zip, path));

	return zip;
}
