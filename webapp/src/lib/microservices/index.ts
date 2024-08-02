// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export function getRandomMicroservicePort() {
	const MIN_PORT = 33000;
	const MAX_PORT = 65000;
	return MIN_PORT + Math.floor(Math.random() * (MAX_PORT - MIN_PORT));
}
