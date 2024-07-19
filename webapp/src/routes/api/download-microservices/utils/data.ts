// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import slugify from 'slugify';

export function cleanUrl(url: string) {
	return url.endsWith('/') ? url.slice(0, -1) : url;
}

export function createSlug(string: string) {
	return slugify(string, {
		replacement: '_',
		lower: true,
		strict: true
	});
}
