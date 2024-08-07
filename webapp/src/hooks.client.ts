// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import * as Sentry from '@sentry/sveltekit';
import { currentUser, pb } from '$lib/pocketbase';
import type { AuthStoreModel } from '$lib/pocketbase';

// If you don't want to use Session Replay, remove the `Replay` integration,
// `replaysSessionSampleRate` and `replaysOnErrorSampleRate` options.
Sentry.init({
	dsn: 'https://f1256ba86cba40e094cf988b4ce32aae@o822807.ingest.sentry.io/4505521418338304',
	integrations: [
		Sentry.replayIntegration(),
	],
	replaysSessionSampleRate: 1,
	replaysOnErrorSampleRate: 1
});

pb.authStore.loadFromCookie(document.cookie);
pb.authStore.onChange(() => {
	currentUser.set(pb.authStore.model as AuthStoreModel);
	document.cookie = pb.authStore.exportToCookie({ httpOnly: false, secure: false });
});

export const handleError = Sentry.handleErrorWithSentry();
