// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { fromBER } from 'asn1js';

// some buffer utils
export function arrayBufferToHex(buf: ArrayBuffer): string {
	return Array.from(
		new Uint8Array(buf),
		(byte) => {
			return ('0' + (byte & 0xff).toString(16)).slice(-2);
		}
	).join('');
}

export function byteStringBufferToArrayBuffer(buffer: ByteStringBuffer): ArrayBuffer {
    const byteString = buffer.getBytes();
    const arrayBuffer = new Uint8Array(
        Array.from(byteString, char => char.charCodeAt(0))
    ).buffer;
	return arrayBuffer;
}

// asn1 decode
export function decodeAsn1(buf: unit8Array) {
	const asn1 = fromBER(buf);
	if (asn1.offset === -1) {
		throw new Error("Error parsing ASN.1 structure");
	}
	return asn1.result;
}